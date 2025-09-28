"use server";

import { runTransfer } from "@/lib/transfer/runTransfer";
import type { TransferDraft } from "@prisma/client";

export async function finalizeTransfer(transfer: TransferDraft) {
  const result = await runTransfer({
    userId: transfer.userId,
    source: transfer.source,
    dest: transfer.dest,
    srcPlaylistId: transfer.srcPlaylistId,
    destPlaylistId: transfer.destPlaylistId,
    srcPlaylistName: transfer.srcPlaylistName,
    destDraft: transfer.destDraftIsPublic && transfer.destDraftName ? {name: transfer.destDraftName, isPublic: transfer.destDraftIsPublic} : null,
    destPlaylistName: transfer.destPlaylistName ? transfer.destPlaylistName : null,
  })
  return result;
}