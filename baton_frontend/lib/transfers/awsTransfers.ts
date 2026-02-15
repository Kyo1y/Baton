import "server-only";
import { awsGet, awsPut, awsPost } from "../aws/awsDb";
import { TransferHistoryPage } from "@/integrations/types";
import type { TransferDraft, Provider} from "@prisma/client";

export async function findTransferById(transferId?: string) {
    return await awsGet<TransferDraft>(
        "/transfers/find",
        { transferId }
    )
}

export async function findTransferByUserSrcDest(
    userId: string,
    source: Provider,
    dest: Provider,
) {
    return await awsGet<TransferDraft>(
        "/transfers/find",
        { userId, source, dest }
    )
}

export async function findTransferHistory(userId: string, cursor?: string) {
    return await awsGet<TransferHistoryPage>(
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
    console.log("transferId, status, added, failed, copies")
    console.log(transferId, status, added, failed, copies)
    return await awsPut<TransferDraft>(
        "/transfers/update-by-id",
        { transferId, status, added, failed, copies }
    )
}

export async function claimTransfer( transferId: string) {
    return await awsPut<{ res: string }>(
        "/transfers/claim",
        { transferId }
    )
}