"use server";
import { createTransfer } from "@/lib/transfers/awsTransfers";


export async function saveTransferDraft(params: {
  userId: string,
  source: string,
  dest: string,
  srcPlaylistId: string,
  destPlaylistId: string,
  srcPlaylistName: string,
  destDraft?: { name: string, isPublic: boolean } | null,
  destPlaylistName?: string | null,
}) {
    const { userId, source, dest, srcPlaylistId, destPlaylistId, srcPlaylistName, destDraft, destPlaylistName } = params;

    if (destDraft) {
      const newTransfer = await createTransfer(userId, source, dest, srcPlaylistId, destPlaylistId, srcPlaylistName, destPlaylistName, destDraft.name, destDraft.isPublic,)
      if (!newTransfer) {
        throw new Error("Could not save transfer info")
      }
      return newTransfer.id;
    }
    else {
      const newTransfer = await createTransfer(userId, source, dest, srcPlaylistId, destPlaylistId, srcPlaylistName, destPlaylistName)
      if (!newTransfer) {
        throw new Error("Could not save transfer info")
      }
      return newTransfer.id;
    }
}