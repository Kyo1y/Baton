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

export type TransferId = {
  id: string;
};

export type RunTransferResult = {
    source: string;
    dest: string;
    destPlaylistName: string;
    srcPlaylistName: string;
    added: number;
    failed: number;
    copies: number;
};

export async function runTransfer(params: TransferId): Promise<RunTransferResult> {
    const { id } = params;
    const transfer = await prisma.transferDraft.findUnique({
        where: { id }
    })
    if (!transfer) throw new Error("Transfer data was lost. Please try again.");
    const [userId, srcPlaylistId, destPlaylistId, destDraft, srcPlaylistName, destPlaylistName, source, dest] = [
        transfer.userId, transfer.srcPlaylistId, transfer.destPlaylistId, { name: transfer.destDraftName, isPublic: transfer.destDraftIsPublic }, 
        transfer.srcPlaylistName, transfer.destPlaylistName, transfer.source, transfer.dest
    ]

    const srcAdapter = getAdapter(source);
    const destAdapter = getAdapter(dest);
    const srcTracks = await srcAdapter.listAllPlaylistTracks(userId, srcPlaylistId);
    if (destPlaylistId === "__draft__") {
        if (destDraft.name == null || destDraft.isPublic == null) {
            throw new Error("Missing draft name/privacy status to create destination playlist.");
        }
        const newPlaylistId = await destAdapter.createPlaylist(userId, destDraft.name, destDraft.isPublic);
        const addingRes = await destAdapter.addTracks(userId, newPlaylistId, srcTracks, true);
        const failed = addingRes[0];
        const copies = addingRes[1];
        const addedCounted = srcTracks.length - failed.length;
        const failedCounted = failed.length;
        const result = {
            source,
            dest,
            destPlaylistName: destDraft.name,
            srcPlaylistName: srcPlaylistName,
            added: addedCounted,
            failed: failedCounted,
            copies: copies,
        }
        
        await prisma.transferDraft.update({
            where: { id },
            data: {
                status: failedCounted > 0 ? "PARTIAL" : "SUCCESS",
                added: addedCounted,
                failed: failedCounted,
            },
        });

        return result;
    }
    else {
        const addingRes = await destAdapter.addTracks(userId, destPlaylistId, srcTracks, false);
        const failed = addingRes[0];
        const copies = addingRes[1];
        const addedCounted = srcTracks.length - failed.length - copies;
        const failedCounted = failed.length;
        const result = {
            source,
            dest,
            destPlaylistName: destPlaylistName!,
            srcPlaylistName: srcPlaylistName,
            added: addedCounted,
            failed: failedCounted,
            copies: copies,
        }

        await prisma.transferDraft.update({
            where: { id },
            data: {
                status: failedCounted > 0 ? "PARTIAL" : "SUCCESS",
                added: addedCounted,
                failed: failedCounted,
                copies: copies,
            },
        });
        
        return result;
    }
}