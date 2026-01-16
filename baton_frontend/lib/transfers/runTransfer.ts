import { getAdapter } from "@/integrations/registry";
import  { Provider } from "@prisma/client";
import { findTransferById, updateTransfer } from "./awsTransfers";

export type RunTransferInput = {
  userId: string;
  source: Provider;
  dest: Provider;
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
    source: Provider;
    dest: Provider;
    destPlaylistName: string;
    srcPlaylistName: string;
    added: number;
    failed: number;
    copies: number;
};


export async function runTransfer(params: TransferId): Promise<RunTransferResult> {
    const { id } = params;
    const res = await findTransferById(id);
    if (!res) {
        throw new Error("Transfer could not be found");
    }

    const transfer = res;
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
        const status = failedCounted > 0 ? "PARTIAL" : "SUCCESS";
        const result = {
            source,
            dest,
            destPlaylistName: destDraft.name,
            srcPlaylistName: srcPlaylistName,
            added: addedCounted,
            failed: failedCounted,
            copies: copies,
        }
        
        const res = await updateTransfer(id, status, addedCounted, failedCounted, copies);

        if(!res) {
            throw new Error("Could not update transfer draft")
        }

        return result;
    }
    else {
        const addingRes = await destAdapter.addTracks(userId, destPlaylistId, srcTracks, false);
        const failed = addingRes[0];
        const copies = addingRes[1];
        const addedCounted = srcTracks.length - failed.length - copies;
        const failedCounted = failed.length;
        const status = failedCounted > 0 ? "PARTIAL" : "SUCCESS";
        const result = {
            source,
            dest,
            destPlaylistName: destPlaylistName!,
            srcPlaylistName: srcPlaylistName,
            added: addedCounted,
            failed: failedCounted,
            copies: copies,
        }
        
        const res = await updateTransfer(id, status, addedCounted, failedCounted, copies);

        if(!res) {
            throw new Error("Could not update transfer draft")
        }
        
        return result;
    }
}