"use server";

import { runTransfer } from "@/lib/transfer/runTransfer";
import { prisma } from "@/lib/prisma";
import { TransferStatus } from "../../../node_modules/.prisma/client/index";


export async function finalizeTransfer(transferId: string) {
  const claimed = await prisma.transferDraft.updateMany({
    where: { id: transferId, status: TransferStatus.CREATED, startedAt: null},
    data: { status: TransferStatus.RUNNING, startedAt: new Date() }
  })
  if (claimed.count === 0) {
    const t = await prisma.transferDraft.findUnique({ where: { id: transferId }});
    if (!t) throw new Error("Transfer data lost. Please try again")
    if (t.status == TransferStatus.RUNNING) {
      const result = await runTransfer({ id: transferId })
      return result;
    }

    else if (
      t.status == TransferStatus.PARTIAL || 
      t.status == TransferStatus.FAILED || 
      t.status == TransferStatus.SUCCESS) {
      return { source: t.source, dest: t.dest, added: t?.added ?? 0, failed: t?.failed ?? 0, copies: t?.copies ?? 0, srcPlaylistName: t?.srcPlaylistName ?? "", destPlaylistName: t?.destPlaylistName ?? "" };
    }
  }
  else {
    const result = await runTransfer({ id: transferId })
    return result;
  }
}