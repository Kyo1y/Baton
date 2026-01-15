import "server-only";
import { awsGet, awsPost } from "../aws/awsDb";
import type { TrackWithProviderId } from "@/integrations/types";

export async function ytmusicLookup(altKeyParam: string, isrc: string | null) {
    return await awsGet<{ canonicalId: string; ytmusicExternalId: string | null }>(
        "/ytmusic/canonical/lookup",
        { isrc: isrc ?? undefined, altKey: altKeyParam }
    );
}

export async function ytmusicUpsertEID(ytmusicId: string, canonicalId: string, isrc: string | null) {
    return await awsPost<{ externalId: string }>(
        "/ytmusic/external-id/upsert",
        { canonicalId, ytmusicId, isrc }
    );
}

export async function ytmusicPair(t: TrackWithProviderId<"ytmusic">, altKeyParam: string, isrcParam?: string) {
    return await awsPost<{ canonicalId: string; ytmusicExternalId: string }>(
        "/ytmusic/pair",
        { t, altKeyParam, isrcParam }
    );
}