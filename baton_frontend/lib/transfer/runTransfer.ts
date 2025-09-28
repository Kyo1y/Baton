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
  added: number;
  failed: number;
};

export async function runTransfer(params: RunTransferInput): Promise<RunTransferResult> {
    const { userId, source, dest, srcPlaylistId, destPlaylistId, srcPlaylistName,  destDraft, destPlaylistName } = params;

    const srcAdapter = getAdapter(source);
    const destAdapter = getAdapter(dest);

    const srcTracks = await srcAdapter.listAllPlaylistTracks(userId, srcPlaylistId);
    
    if (destPlaylistId === "__draft__") {
      if (!destDraft) throw new Error("Missing draft details to create destination playlist.");

      const newPlaylistId = await destAdapter.createPlaylist(userId, destDraft.name, destDraft.isPublic)
      const failed = await destAdapter.addTracks(userId, newPlaylistId, srcTracks);
      const result = {
        destPlaylistName: destDraft.name,
        added: dest == "spotify" ? srcTracks.length - failed[0]["durationMs"] : srcTracks.length - failed.length,
        failed: dest == "spotify" ? failed[0]["durationMs"] : failed.length,
      }
      return result;
    }
    else {
      const failed = await destAdapter.addTracks(userId, destPlaylistId, srcTracks);
      const result = {
        destPlaylistName: destPlaylistName!,
        added: dest == "spotify" ? srcTracks.length - failed[0]["durationMs"] : srcTracks.length - failed.length,
        failed: dest == "spotify" ? failed[0]["durationMs"] : failed.length,
      }
      return result;
    }

}