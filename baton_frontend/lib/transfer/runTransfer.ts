import { getAdapter } from "@/integrations/registry";
import { prisma } from "@/lib/prisma";

export type RunTransferInput = {
  userId: string;
  source: string;
  dest: string;
  srcPlaylistId: string;
  destPlaylistId: string;
  srcPlaylistName: string;
  destDraft?: { name: string; isPublic: boolean; } | null;
  destPlaylistName?: string | null;
};

export type RunTransferResult = {
  destPlaylistName: string;
  srcPlaylistName: string;
  added: number;
  failed: number;
  copies: number;
};

export async function runTransfer(params: RunTransferInput): Promise<RunTransferResult> {
    const { userId, source, dest, srcPlaylistId, destPlaylistId, srcPlaylistName, destDraft, destPlaylistName } = params;

    const srcAdapter = getAdapter(source);
    const destAdapter = getAdapter(dest);
    const srcTracks = await srcAdapter.listAllPlaylistTracks(userId, srcPlaylistId);
    if (destPlaylistId === "__draft__") {
      if (!destDraft) throw new Error("Missing draft details to create destination playlist.");

        const newPlaylistId = await destAdapter.createPlaylist(userId, destDraft.name, destDraft.isPublic);
        const addingRes = await destAdapter.addTracks(userId, newPlaylistId, srcTracks);
        const failed = addingRes[0];
        const copies = addingRes[1];
        const addedCounted = srcTracks.length - failed.length;
        const failedCounted = failed.length;
        const result = {
            destPlaylistName: destDraft.name,
            srcPlaylistName: srcPlaylistName,
            added: addedCounted,
            failed: failedCounted,
            copies: copies,
        }
        const latest = await prisma.transferDraft.findFirst({
            where: { status: "RUNNING" },
            orderBy: { createdAt: "desc" },
            select: { id: true },
        });

        if (latest) {
            await prisma.transferDraft.update({
                where: { id: latest.id },
                data: {
                status: failedCounted > 0 ? "PARTIAL" : "SUCCESS",
                added: addedCounted,
                failed: failedCounted,
                },
            });
        }
        console.log("RUN TRANSFER RES LINE 62",result);
        return result;
    }
    else {
        const addingRes = await destAdapter.addTracks(userId, destPlaylistId, srcTracks);
        const failed = addingRes[0];
        const copies = addingRes[1];
        const addedCounted = srcTracks.length - failed.length - copies;
        const failedCounted = failed.length;
        const result = {
            destPlaylistName: destPlaylistName!,
            srcPlaylistName: srcPlaylistName,
            added: addedCounted,
            failed: failedCounted,
            copies: copies,
        }
        const latest = await prisma.transferDraft.findFirst({
            where: { status: "RUNNING" },
            orderBy: { createdAt: "desc" },
            select: { id: true },
        });

        if (latest) {
            await prisma.transferDraft.update({
                where: { id: latest.id },
                data: {
                status: failedCounted > 0 ? "PARTIAL" : "SUCCESS",
                added: addedCounted,
                failed: failedCounted,
                copies: copies,
                },
            });
        }
        console.log("RUN TRANSFER RES LINE 95", result);
        return result;
    }
}