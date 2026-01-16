"use server";

import { runTransfer } from "@/lib/transfers/runTransfer";
import { claimTransfer, findTransferById } from "@/lib/transfers/awsTransfers";

export async function finalizeTransfer(transferId: string) {
  const claim = await claimTransfer(transferId);

  if (claim.res === "claimed") {
    const result = await runTransfer({ id: transferId });
    return result;
  }
  else if (claim.res === "completed") {
    const result = await findTransferById(transferId);
    return result;
  }
  else if (claim.res === "running") {
    throw new Error("Transfer was already running");
  }
}