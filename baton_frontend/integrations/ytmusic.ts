import ensureAccessToken from "@/lib/ensureAccessToken";
import { MusicAdapter, Playlist, Track, Page, TrackWithProviderId } from "./types";
import { ytmusicLookup, ytmusicPair, ytmusicUpsertEID } from "@/lib/ytmusic/awsYtmusic";
import makeAltKey from "@/lib/hashKey";

const API = "https://www.googleapis.com/youtube/v3";

function normalizeTitle(title: string): string {
    let s = (title ?? "").normalize("NFKC");  
    return s.replace(/\s*\([^()]*\)\s*/g, " ")
    .replace(/\s*\[[^\[\]]*\]\s*/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\s+([.,;:!?])/g, "$1")
    .trim();
}

function normalizeArtist(artist: string): string {
    let s = (artist ?? "").normalize("NFKC");
    s = s.replace(/[\u200B-\u200D\uFEFF]/g, "");
    s = s.trim();

    // 1) Auto-generated Topic channels: "<Artist> - Topic"
    //    (YouTube’s Topic channels are titled "Artist Name - Topic")
    s = s.replace(/\s*[-–—]\s*topic$/i, "");

    // 2) VEVO-branded channels: "ArtistVEVO" / "Artist Vevo" / "Artist - VEVO"
    //    Keep conservative: remove a trailing VEVO token, not mid-word.
    s = s.replace(/\s*(?:[-_. ]+)?vevo$/i, "");

    // 3) collapse leftover whitespace
    s = s.replace(/\s+/g, " ").trim();

    return s;
}

async function findRow(isrcParam: string | null, altKeyParam: string) {
    const resp = await ytmusicLookup(altKeyParam, isrcParam);

    return resp;
}

function itemizeTracks(tracks: any): Track[] {
    return tracks.map((t: any) => ({
            title: t.snippet.title,
            artists: [t.snippet.videoOwnerChannelTitle || t.snippet.channelTitle].filter(Boolean),
            durationMs: 0,
            pairs: [{ provider: "ytmusic", id: t.contentDetails.videoId }],
    }));
}

async function addIdToRow(t: Track, access: string, rowId: string): Promise<string> {
    const track = await ytmusicAdapter.fetchTrack(t, access);
    if (track == false) {
        return "404";
    }
    const id = track.ytmusicId;
    await ytmusicUpsertEID(id, rowId, track.isrc);
    return id;
}

async function createPair(t: Track, access: string, altKeyParam: string, isrcParam?: string): Promise<string> {
    const track = await ytmusicAdapter.fetchTrack(t, access);
    if (track == false) {
        return "404";
    }
    
    const resp = await ytmusicPair(track, altKeyParam, isrcParam);

    return resp.ytmusicExternalId;
}

export const ytmusicAdapter: MusicAdapter<"ytmusic"> = {
    async listPlaylists(userId: string): Promise<Page<Playlist>> {
        const access = await ensureAccessToken(userId, "ytmusic");
        const res = await fetch(
            `${API}/playlists?part=snippet,status&mine=true&maxResults=50`, {
                headers: {Authorization: `Bearer ${access}`},
                cache: "no-store" 
            }
        )
        const playlists = await res.json();
        const page = {
            items: playlists.items.map((p: any): Playlist => ({
                id: p.id, name: p.snippet.title, thumbnail: p.snippet.thumbnails.default, isPublic: p.status.privacyStatus
            })),
            cursor: playlists.nextPageToken ?? null
        }
        if (page.cursor) {
            const res = await fetch(
                `${API}/playlists?part=snippet&mine=true&maxResults=50&pageToken=${page.cursor}`,
                {
                    headers: {Authorization: `Bearer ${access}`},
                    cache: "no-store" 
                }
            )
            const playlists = await res.json();
            page.items.push(
                playlists.items.map((p: any): Playlist => ({
                    id: p.id, name: p.snippet.title, thumbnail: p.snippet.thumbnails.default, isPublic: p.status.privacyStatus
                }))
            )
        }
        return page;
    },
    async listPlaylistTracks(userId, playlistId, cursor): Promise<Page<Track>> {
        const access = await ensureAccessToken(userId, "ytmusic");
        const url = new URL(`${API}/playlistItems`);
        const params = new URLSearchParams({
            part: "snippet, contentDetails",
            playlistId: playlistId,
            maxResults: "50",
        })
        if (cursor) params.set("pageToken", cursor);
        url.search = params.toString();
        const res = await fetch(
            url.toString(), {
                headers: {Authorization: `Bearer ${access}`},
                cache: "no-store"
            }
        )
        if (!res.ok) {
            const body = await res.text().catch(() => "");
            throw new Error(`Failed to fetch playlist items: ${res.status} ${res.statusText} ${body}`);
        }
        const data = await res.json();
       
        const items: Track[] = []; 
        items.push(...(itemizeTracks(data.items)));

        return {
            items: items,
            cursor: data.nextPageToken
        }
    },
    async listAllPlaylistTracks(
        userId: string, 
        playlistId: string, 
        startCursor?: string
    ): Promise<Track[]> {
        let cursor = startCursor;
        const all: Track[] = [];

        do {
            const page = await this.listPlaylistTracks(userId, playlistId, cursor);
            all.push(...page.items);
            cursor = page.cursor ?? undefined;
        } while (cursor);

        return all;
    },
    async createPlaylist(userId: string, name: string, publicParam: boolean): Promise<string> {
        const access = await ensureAccessToken(userId, "ytmusic");
        const url = new URL(`${API}/playlists`);
        url.searchParams.set("part", "snippet, status");
        url.searchParams.set("fields", "id");
        console.log("PUBLIC PARAM YTMUSIC ADAPTER", publicParam ? "ST: public" : "ST: private")
        const body = {
            snippet: { 
                title: name,
                privacyStatus: publicParam ? "public" : "private",
             },
        }
        const res = await fetch(
            url, {
                method: "POST",
                headers: {Authorization: `Bearer ${access}`},
                body: JSON.stringify(body),
                cache: "no-store",
            }
        )
        if (!res.ok) {
            const body = await res.text().catch(() => "");
            throw new Error(`Failed to create a playlist: ${res.status} ${res.statusText} ${body}`);
        }
        const playlist = await res.json();

        return playlist.id;
    },
    async trackAlreadyExists(targetTrackId: string, targetPlaylist: Track[]): Promise<boolean> {
        for (const track of targetPlaylist) {
            if (track.pairs[0].id === targetTrackId) {
                return true
            }
        }
        return false;
    },
    async addTracks(userId: string, playlistId: string, tracks: Track[], isNewPlaylist: boolean): Promise<[Track[], number]> {
        const access = await ensureAccessToken(userId, "ytmusic");
        const url = new URL(`${API}/playlistItems`);
        const failed: Track[] = [];
        let copies: number = 0;
        url.search = (new URLSearchParams({ part: "snippet, status"})).toString();
        let targetPlaylistTracks: Track[] | null = null;
        if (!isNewPlaylist) {
            targetPlaylistTracks = await this.listAllPlaylistTracks(userId, playlistId);
        }
        for (let t of tracks) {
            let id: string | null = null;
            // const normArtistTitle = await normalizeGPT(t.title, t.artists[0]);
            const normArtist = normalizeArtist(t.artists[0]);
            const normTitle = normalizeTitle(t.title);
            const normTrack: Track = {
                title: normTitle,
                artists: [normArtist],
                isrc: t.isrc,
                durationMs: t.durationMs,
                pairs: t.pairs,
            }
            t = normTrack;
            const altKey = makeAltKey(t.title, t.artists, 0);
            // check if Track includes ISRC
            if (t.isrc) {
                const row = await findRow(t.isrc, altKey);
                // check if row exists for current ISRC
                if (row) {
                    const ytmusicId = row.ytmusicExternalId ?? null;
                    // check if ytmusic ID for that ISRC exists in that row
                    if (ytmusicId) {
                        id = ytmusicId;
                    }
                    // if not, fetch ytmusic ID by that ISRC and add it to the row
                    else {
                        id = await addIdToRow(t, access, row.canonicalId);
                    }
                } 
                // if row does not exist, create canonical track for that ISRC
                else {
                    id = await createPair(t, access, altKey, t.isrc)
                }
            }
            // if not, lookup by altKey (hash of title+artist+duration)
            else {
                const altKey = makeAltKey(t.title, t.artists, t.durationMs);
                const row = await findRow(null, altKey);
                // check if row by altKey exists
                if (row) {
                    const ytmusicId = row.ytmusicExternalId?? null;
                    // check if ytmusic ID associated with that row exists
                    if (ytmusicId) {
                        id = ytmusicId;
                    } 
                    // if not, fetch ytmusic ID by search and add it to the row
                    else {
                        id = await addIdToRow(t, access, row.canonicalId);
                    }
                }
                // if not, create canonicalTrack with that altKey
                else {
                    id = await createPair(t, access, altKey);
                }
            }
            

            if (!isNewPlaylist && targetPlaylistTracks) {
                const alreadyExists = await this.trackAlreadyExists(id, targetPlaylistTracks);
                if (alreadyExists) {
                    copies++;
                    continue;
                }
            }
            const body = { 
                snippet: {
                    "playlistId": `${playlistId}`,
                    "resourceId": { "kind": "youtube#video", "videoId": `${id}` }
                } 
            }
            const res = await fetch(
                url, {
                    method: "POST",
                    headers: { Authorization: `Bearer ${access}` },
                    cache: "no-store",
                    body: JSON.stringify(body),
                }
            )
            if (!res.ok) {
                failed.push({
                    title: t.title, 
                    isrc: null,
                    artists: t.artists, 
                    durationMs: 0,
                    pairs: [],
                });
            }
        }
        return [failed, copies];
    },
    async fetchTrack(t: Track, access: string): Promise<false | TrackWithProviderId<"ytmusic">> {
        const url = new URL(`${API}/search`);
        url.search = new URLSearchParams({
            part: "snippet",
            q: `${ t.title } ${ t.artists[0] }`.trim(),
            type: "video"
        }).toString()
        const res = await fetch(
            url, {
                headers: { Authorization: `Bearer ${access}` },
                cache: "no-store"
            }
        )
        if (!res.ok) {
            const body = await res.text().catch(() => "");
            throw new Error(`Failed to fetch a track: ${res.status} ${res.statusText} ${body}`);
        }
        const data = await res.json();

        const first = data.items[0];

        const id = first.id.videoId;
        const title = first.snippet.title;
        const artist = normalizeArtist(first.snippet.videoOwnerChannelTitle)
        return {
            title: title,
            artists: [artist],
            isrc: null,
            durationMs: 0,
            pairs: [{ provider: "ytmusic", id: id}],
            ytmusicId: id,
        }
    },
}