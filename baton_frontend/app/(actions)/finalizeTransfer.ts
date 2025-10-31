"use server";

import { runTransfer } from "@/lib/transfer/runTransfer";
import type { TransferDraft } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { TransferStatus } from "@prisma/client";


export async function finalizeTransfer(transferId: string) {
  const claimed = await prisma.transferDraft.updateMany({
    where: { id: transferId, status: TransferStatus.CREATED, startedAt: null},
    data: { status: TransferStatus.RUNNING, startedAt: new Date() }
  })
  console.log("JOB CLAIMED:", claimed.count)
  if (claimed.count === 0) {
    // Someone else already started (or it finished). Read the latest row and exit.
    const t = await prisma.transferDraft.findUnique({ where: { id: transferId }});
    if (!t) throw new Error("Transfer data lost. Please try again")
    if (t.status == TransferStatus.RUNNING) {
      const result = await runTransfer({ id: transferId })
      return result;
    }

    // Option: if already SUCCESS/PARTIAL, just return its stats
    else if (
      t.status == TransferStatus.PARTIAL || 
      t.status == TransferStatus.FAILED || 
      t.status == TransferStatus.SUCCESS) {
      return { added: t?.added ?? 0, failed: t?.failed ?? 0, copies: t?.copies ?? 0, srcPlaylistName: t?.srcPlaylistName ?? "", destPlaylistName: t?.destPlaylistName ?? "" };
    }
  }
  else {
    const result = await runTransfer({ id: transferId })
    return result;
  }
}