import "server-only";
import { awsGet, awsPut, awsPost } from "../aws/awsDb";
import { TransferHistoryPage } from "@/integrations/types";
import type { TransferDraft, Provider} from "@prisma/client";

export async function findTransferById(transferId?: string) {
    return await awsGet<{ row: TransferDraft }>(
        "/transfers/find",
        { transferId }
    )
}

export async function findTransferByUserSrcDest(
    userId: string,
    source: Provider,
    dest: Provider,
) {
    return await awsGet<{ row: TransferDraft }>(
        "/transfers/find",
        { userId, source, dest }
    )
}

export async function findTransferHistory(userId: string, cursor?: string) {
    return await awsGet<{ obj: TransferHistoryPage }>(
        "/transfers/find",
        { userId, cursorCreatedAt: cursor }
    )
}

export async function createTransfer(
    userId: string,
    source: string,
    dest: string,
    srcPlaylistId: string,
    destPlaylistId: string,
    srcPlaylistName: string,
    destPlaylistName?: string | null,
    destDraftName?: string | null,
    destDraftIsPublic?: boolean,
) {
    return await awsPost<{ id: string }>(
        "/transfers/create",
        { 
            userId, source, dest, srcPlaylistId, destPlaylistId, 
            srcPlaylistName, destPlaylistName, 
            destDraftName, destDraftIsPublic,
        }
    )
}

export async function updateTransfer(
    transferId: string,
    status: string,
    added: number,
    failed: number,
    copies: number,
) {
    return await awsPut<{ row: TransferDraft }>(
        "/transfers/update-by-id",
        { transferId, status, added, failed, copies }
    )
}