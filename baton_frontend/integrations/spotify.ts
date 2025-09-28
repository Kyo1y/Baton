import ensureAccessToken from "@/lib/ensureAccessToken";
import { MusicAdapter, Playlist, Track, Page } from "./types";
import { prisma } from "@/lib/prisma";
import makeAltKey from "@/lib/hashKey";
import { PlayIcon } from "lucide-react";

const API = "https://api.spotify.com/v1";

async function findRow(isrcParam: string | null, altKeyParam: string) {
    const method = isrcParam ? { isrc: isrcParam } : { altKey: altKeyParam}
    const row = await prisma.canonicalTrack.findUnique({
        where: method,
        select: {
            id: true,
            externalIds: {
                where: {provider: "spotify"},
                select: {externalId: true}
            }
        }
    })
    return row;
}

async function addIdToRow(t: Track, access: string, rowId: string): Promise<string> {
    const track = await spotifyAdapter.fetchTrack(t, access);
    const id = track.id;
    await prisma.trackExternalId.upsert({
        where: { canonicalId_provider: {canonicalId: rowId, provider: "spotify"} },
        update: { externalId: id },
        create: { canonicalId: rowId, provider: "spotify", externalId: id }
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
        select: { id:true, isrc: true }
    })

    const track = await spotifyAdapter.fetchTrack(t, access);
    if (track.isrc && !canonical.isrc) {
        await prisma.canonicalTrack.update({
            where: { id: canonical.id },
            data: { isrc: track.isrc, altKey: null }
        })
    }
    const externalid = await prisma.trackExternalId.upsert({
        where: { canonicalId_provider: { canonicalId: canonical.id, provider: "spotify" }},
        create: {
            canonicalId: canonical.id,
            provider: "spotify",
            externalId: track.id,
        },
        update: {
            externalId: track.id,
        },
        select: {externalId: true}
    })
    return externalid.externalId;
}

function checkDuplicatePlaylistNames(list: Playlist[]) {
    const idxByName = new Map<string, number[]>();

    for (let i = 0; i < list.length; i++) {
    const n = list[i].name;
    const bucket = idxByName.get(n);
    if (bucket) bucket.push(i);
        else idxByName.set(n, [i]);
    }

    const groups: number[][] = [];
    for (const [, idxs] of idxByName) {
        if (idxs.length > 1) groups.push(idxs);
    }

    const duplicateIndices = groups.flat().sort((a, b) => a - b);
    return duplicateIndices;
}

export const spotifyAdapter: MusicAdapter = {

    async listPlaylists(userId): Promise<Page<Playlist>> {
        const access = await ensureAccessToken(userId, "spotify");
        const res = await fetch(
            // TODO: check if /me/* works
            `${API}/me/playlists`, { 
                headers: { Authorization: `Bearer ${access}`},
                cache: "no-store" 
            }
        )
        const playlistsJson = await res.json();
        const playlists = playlistsJson.items.map((p: any): Playlist => ({
            id: p.id, name: p.name, thumbnail: p.images?.[1], owner: p.owner.display_name, isPublic: p.public
        }))
        const sameNameIdx = checkDuplicatePlaylistNames(playlists);
        sameNameIdx.forEach((i) => {
            playlists[i].name = `${playlists[i].name} (${playlists[i].owner})`
        })
        
        return {
            items: playlists,
            cursor: playlistsJson.next ?? null
        }
    },
    async listPlaylistTracks(userId: string, playlistId: string, cursor?: string): Promise<Page<Track>> {
        const access = await ensureAccessToken(userId, "spotify");
        const url = cursor ?? new URL(`${API}/playlists/${playlistId}/tracks?limit=50`);
        console.log(access)
        const res = await fetch(
            url, { 
                headers: { Authorization: `Bearer ${access}` },
                cache: "no-store"
            }
        )
        if (!res.ok) {
            const body = await res.text().catch(() => "");
            throw new Error(`Failed to fetch playlist items: ${res.status} ${res.statusText} ${body}`);
        }
        const tracks = await res.json();
        return {
            items: tracks.items.map((t: any): Track => ({
                title: t.track.name, 
                artists: [t.track.artists.name], 
                isrc: t.track.external_ids.isrc, 
                durationMs: 0,
                pairs: [{ provider: "spotify", id: t.track.id }]
            })),
            cursor: tracks.next ?? null
        }
    },
    async listAllPlaylistTracks(userId: string, playlistId: string, startCursor?: string): Promise<Track[]> {
        let cursor = startCursor;
        const all: Track[] = [];

        do {
            const page = await this.listPlaylistTracks(userId, playlistId, cursor);
            all.push(...page.items);
            cursor = page.cursor ?? undefined;
        } while (cursor);
        
        return all;
    },
    async fetchTrack(t: Track, access: string): Promise<any> {
        if (t.isrc) {
            const res = await fetch(
                `${API}/search?type=track&q=isrc:${t.isrc}`, {
                    headers: { Authorization: `Bearer ${access}` },
                    cache: "no-store"
                    }
                )
            const trackJson = await res.json();
            return {
                title: trackJson.tracks.items[0].name,
                artists: [trackJson.tracks.items[0].artists[0].name],
                isrc: t.isrc,
                durationMs: 0,
                spotifyId: trackJson.tracks.items[0].id,
            }
        }
        else {
            const query = JSON.stringify(`track:${t.title} artist:${t.artists[0]}`);
            const res = await fetch(
                `${API}/search?type=track&q=${query}`, {
                    headers: { Authorization: `Bearer ${access}` },
                    cache: "no-store",
                }
            )
            if (!res.ok) {
                const body = await res.text().catch(() => "");
                throw new Error(`Failed to fetch a track: ${res.status} ${res.statusText} ${body}`);
            }
            const trackJson = await res.json();
            return {
                title: trackJson.tracks.items[0].name,
                artists: [trackJson.tracks.items[0].artists[0].name],
                isrc: trackJson.tracks.items[0].isrc,
                durationMs: 0,
                spotifyId: trackJson.tracks.items[0].id,
            }
        }
    },
    async addTracks(userId, playlistId, tracks): Promise<Track[]> {
        const access = await ensureAccessToken(userId, "spotify");
        const ids: string[] = [];

        for (const t of tracks) {
            let id: string | null = null;
            // check if Track includes ISRC
            if (t.isrc) {
                const row = await findRow(t.isrc, "");
                // check if row exists for current ISRC
                if (row) {
                    const spotifyId = row.externalIds[0]?.externalId ?? null;
                    // check if spotify ID for that ISRC exists in that row
                    if (spotifyId) {
                        id = spotifyId;
                        ids.push(id);
                    }
                    // if not, fetch spotify ID by that ISRC and add it to the row
                    else {
                        id = await addIdToRow(t, access, row.id);
                        ids.push(id!);
                    }
                } 
                // if row does not exist, create canonical track for that ISRC
                else {
                    id = await createPair(t, access, t.isrc);
                    ids.push(id);
                }
            }
            // if not, lookup by altKey (hash of title+artist+duration)
            else {
                const altKey = makeAltKey(t.title, t.artists, t.durationMs);
                const row = await findRow(null, altKey);
                // check if row by altKey exists
                if (row) {
                    const spotifyId = row.externalIds[0]?.externalId ?? null;
                    // check if spotify ID associated with that row exists
                    if (spotifyId) {
                        id = spotifyId;
                        ids.push(id);
                    } 
                    // if not, fetch spotify ID by search(track: artist:) and add it to the row
                    else {
                        id = await addIdToRow(t, access, row.id);
                        ids.push(id!);
                    }
                }
                // if not, create canonicalTrack with that altKey
                else {
                    id = await createPair(t, access, undefined, altKey);
                    ids.push(id);
                }
            }
        }
        const uniqueIds = [...new Set(ids)];
        let failedCounter = 0;
        for (let i = 0; i < uniqueIds.length; i += 100) {
            const batch = uniqueIds.slice(i, i+100);
            const res = await fetch(
                `${API}/playlists/${playlistId}/tracks`, {
                    method: "POST",
                    headers: { 
                        Authorization: `Bearer ${access}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({uris: batch.map(id => `spotify:track:${id}`)})
                }
            )
            if (!res.ok) {
                failedCounter++;
            }
        }
        return [{
            title: "failed transfers",
            artists: [],
            durationMs: failedCounter * 100,
            pairs: []
        }];
    },
    async createPlaylist(userId: string, name: string, publicParam: boolean): Promise<string> {
        const access = await ensureAccessToken(userId, "spotify");
        const res = await fetch(
            `${API}/me/playlists`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${access}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name,
                    public: publicParam,
                })
            }
        )
        if (res.ok) {
            const playlist = await res.json();
            return playlist.id;
        }
        else {
            const resjson = await res.json();
            return resjson.status;
        }
    }
}