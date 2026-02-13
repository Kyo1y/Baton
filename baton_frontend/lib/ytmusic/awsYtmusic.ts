import "server-only";
import { awsGet, awsPost } from "../aws/awsDb";
import type { TrackWithProviderId } from "@/integrations/types";

export async function ytmusicLookup(altKeyParam: string, isrc: string | null) {
    const res = await awsGet<{ canonicalId: string; ytmusicExternalId: string | null } | null>(
        "/ytmusic/canonical/lookup",
        { isrc: isrc ?? undefined, altKey: altKeyParam }
    );

    return res;
}

export async function ytmusicUpsertEID(ytmusicId: string, canonicalId: string, isrcParam: string | null) {
    console.log("ytmusicId, canonicalId")
    console.log(ytmusicId, canonicalId)
    return await awsPost<{ externalId: string }>(
        "/ytmusic/external-id/upsert",
        { canonicalId, ytmusicId, isrcParam }
    );
}

export async function ytmusicPair(t: TrackWithProviderId<"ytmusic">, altKeyParam: string, isrcParam?: string) {
    return await awsPost<{ canonicalId: string; ytmusicExternalId: string }>(
        "/ytmusic/pair",
        { track: t, altKeyParam, isrcParam }
    );
}