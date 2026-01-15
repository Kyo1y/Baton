import "server-only";
import { awsGet, awsPost } from "../aws/awsDb";
import type { TrackWithProviderId } from "@/integrations/types";


export async function spotifyLookup(altKeyParam: string, isrc?: string | null) {
    return await awsGet<{ canonicalId: string; spotifyExternalId: string | null }>(
        "/spotify/canonical/lookup",
        { isrc: isrc ?? undefined, altKey: altKeyParam }
    );
}

export async function spotifyUpsertEID(spotifyId: string, canonicalId: string, isrc: string | null) {
    return await awsPost<{ externalId: string }>(
        "/spotify/external-id/upsert",
        { canonicalId, spotifyId, isrc }
    );
}

export async function spotifyPair(t: TrackWithProviderId<"spotify">, altKeyParam: string, isrcParam?: string) {
    return await awsPost<{ canonicalId: string; spotifyExternalId: string }>(
        "/spotify/pair",
        { t, altKeyParam, isrcParam } 
    );
}

export async function getSpotifyUserId(userId: string) {
    return await awsGet<{ spotifyUserId: string }>(
        "/spotify/user-id",
        { userId }
    )
}