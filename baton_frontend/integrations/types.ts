export type Playlist = { 
    id: string, 
    name: string, 
    thumbnail: { url: string, width: number, height: number},
    owner?: string,
    isPublic: boolean,
}

type IdProviderPair = {
    provider: string,
    id: string
}

export type Track = { 
    title: string, 
    artists: string[],
    isrc?: string,
    durationMs: number,
    pairs: IdProviderPair[],
}

export type Page<T> = { items: T[], cursor?: string | null } 

export interface MusicAdapter {
    listPlaylists(userId: string): Promise<Page<Playlist>>;
    listPlaylistTracks(userId: string, playlistId: string, cursor?: string | null): Promise<Page<Track>>;
    listAllPlaylistTracks(userId: string, playlistId: string, startCursor?: string, ): Promise<Track[]>;
    createPlaylist(userId: string, name: string, publicParam: boolean): Promise<string>;
    addTracks(userId: string, playlistId: string, tracks: Track[], isNewPlaylist: boolean): Promise<[Track[], number]>;
    fetchTrack(t: Track, access: string): Promise<any>;
    trackAlreadyExists(targetTrackId: string, targetPlaylist: Track[]): Promise<boolean>;
}