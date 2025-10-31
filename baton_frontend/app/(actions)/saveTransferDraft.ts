"use server";

import { prisma } from "@/lib/prisma";
/* check if destDraft? won't cause trouble */
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

    const newTransfer = await prisma.transferDraft.create({
        data: { 
          userId, source, dest, srcPlaylistId, destPlaylistId, srcPlaylistName, destDraftName: destDraft?.name, destDraftIsPublic: destDraft?.isPublic, destPlaylistName,
        },
        select: { id: true }
    });

    return newTransfer;
}