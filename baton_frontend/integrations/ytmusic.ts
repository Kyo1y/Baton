import ensureAccessToken from "@/lib/ensureAccessToken";
import { MusicAdapter, Playlist, Track, Page } from "./types";
import { prisma } from "@/lib/prisma";
import makeAltKey from "@/lib/hashKey";
import normalizeGPT from "@/lib/openai";

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
    let s = (artist ?? "").normalize("NFKC");                 // unify unicode forms
    s = s.replace(/[\u200B-\u200D\uFEFF]/g, "");           // zero-width chars
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
    const method = isrcParam ? { isrc: isrcParam } : { altKey: altKeyParam}
    const row = await prisma.canonicalTrack.findUnique({
        where: method,
        select: {
            id: true,
            externalIds: {
                where: {provider: "ytmusic"},
                select: {externalId: true}
            }
        }
    })
    return row;
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
    const id = track.ytmusicId;
    await prisma.trackExternalId.upsert({
        where: { canonicalId_provider: {canonicalId: rowId, provider: "ytmusic"} },
        update: { externalId: id },
        create: { canonicalId: rowId, provider: "ytmusic", externalId: id }
    })
    return id;
}

async function createPair(t: Track, access: string, isrcParam?: string, altKeyParam?: string): Promise<string> {
    const data = {
        title: t.title,
        artists: t.artists,
        durationMs: 0,
        ...(isrcParam ? { isrc: isrcParam } : {}),
        ...(!isrcParam && altKeyParam ? {altKey: altKeyParam} : {}),
    }

    const canonical = await prisma.canonicalTrack.upsert({
        where: isrcParam ? { isrc: isrcParam } : { altKey: altKeyParam },
        create: data,
        update: {
            title: data.title,
            artists: data.artists,
            durationMs: data.durationMs,
        },
        select: {id:true}
    })

    const track = await ytmusicAdapter.fetchTrack(t, access);
    const externalid = await prisma.trackExternalId.upsert({
        where: { canonicalId_provider: { canonicalId: canonical.id, provider: "ytmusic" }},
        create: {
            canonicalId: canonical.id,
            provider: "ytmusic",
            externalId: track.ytmusicId,
        },
        update: {
            externalId: track.ytmusicIid
        },
        select: {externalId: true}
    })
    return externalid.externalId;
}

export const ytmusicAdapter: MusicAdapter = {
    async listPlaylists(userId: string): Promise<Page<Playlist>> {
        const access = await ensureAccessToken(userId, "ytmusic");
        const res = await fetch(
            `${API}/playlists?part=snippet&mine=true&maxResults=50`, {
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
    async addTracks(userId: string, playlistId: string, tracks: Track[]): Promise<[Track[], number]> {
        const access = await ensureAccessToken(userId, "ytmusic");
        const url = new URL(`${API}/playlistItems`);
        const failed: Track[] = [];
        let copies: number = 0;
        url.search = (new URLSearchParams({ part: "snippet, status"})).toString();
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
            
            // check if Track includes ISRC
            if (t.isrc) {
                const row = await findRow(t.isrc, "");
                // check if row exists for current ISRC
                if (row) {
                    const ytmusicId = row.externalIds[0]?.externalId ?? null;
                    // check if ytmusic ID for that ISRC exists in that row
                    if (ytmusicId) {
                        id = ytmusicId;
                    }
                    // if not, fetch ytmusic ID by that ISRC and add it to the row
                    else {
                        id = await addIdToRow(t, access, row.id);
                    }
                } 
                // if row does not exist, create canonical track for that ISRC
                else {
                    id = await createPair(t, access, t.isrc);
                }
            }
            // if not, lookup by altKey (hash of title+artist+duration)
            else {
                const altKey = makeAltKey(t.title, t.artists, t.durationMs);
                const row = await findRow(null, altKey);
                // check if row by altKey exists
                if (row) {
                    const ytmusicId = row.externalIds[0]?.externalId ?? null;
                    // check if ytmusic ID associated with that row exists
                    if (ytmusicId) {
                        id = ytmusicId;
                    } 
                    // if not, fetch ytmusic ID by search and add it to the row
                    else {
                        id = await addIdToRow(t, access, row.id);
                    }
                }
                // if not, create canonicalTrack with that altKey
                else {
                    id = await createPair(t, access, undefined, altKey);
                }
            }
            const targetPlaylistTracks = await this.listAllPlaylistTracks(userId, playlistId);
            const alreadyExists = await this.trackAlreadyExists(id, targetPlaylistTracks);
            if (alreadyExists) {
                copies++;
                continue;
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
                    artists: t.artists, 
                    durationMs: 0,
                    pairs: [],
                });
            }
        }
        return [failed, copies];
    },
    async fetchTrack(t: Track, access: string): Promise<any> {
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
        console.log(`--------AT FETCHTRACK MV ID: ${id}`)
        const title = first.snippet.title;
        const artist = normalizeArtist(first.snippet.videoOwnerChannelTitle)
        return {
            title: title,
            artists: [artist],
            isrc: null,
            durationMs: 0,
            ytmusicId: id
        }
    },
}