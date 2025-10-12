export type OAuthProviderConfig = {
    authorizeUrl: string,
    tokenUrl: string,
    scopes: string[],
    clientId: string,
    clientSecret?: string,
    usePKCE: boolean,
    mapTokenResponse: (j:any)=>{ access_token:string; refresh_token:string; expires_at:number };
}

export const OAUTH: Record<string, OAuthProviderConfig> = {
    "spotify": {
        authorizeUrl: "https://accounts.spotify.com/authorize",
        tokenUrl: "https://accounts.spotify.com/api/token",
        scopes: ["playlist-read-private", "playlist-modify-private", "user-library-read", "user-library-modify", "playlist-modify-public"],
        clientId: process.env.SPOTIFY_CLIENT_ID!,
        usePKCE: true,
        mapTokenResponse: j => ({
            access_token: j.access_token,
            refresh_token: j.refresh_token,
            expires_at: Math.floor(Date.now()/1000) + (j.expires_in ?? 3600)
        }),
    },
    "ytmusic": {
        authorizeUrl: "https://accounts.google.com/o/oauth2/v2/auth",
        tokenUrl: "https://oauth2.googleapis.com/token",
        scopes: ["https://www.googleapis.com/auth/youtube.force-ssl", "https://www.googleapis.com/auth/userinfo.profile"],
        clientId: process.env.YOUTUBE_CLIENT_ID!,
        clientSecret: process.env.YOUTUBE_CLIENT_SECRET!,
        usePKCE: true,
        mapTokenResponse: j => ({
            access_token: j.access_token,
            refresh_token: j.refresh_token,
            expires_at: Math.floor(Date.now()/1000) + (j.expires_in ?? 3600),
        }),
    }
}