"use server";
import { prisma } from "@/lib/prisma";
import { revalidateTag } from "next/cache";

export async function disconnectService(id: string, userId: string, provider: string) {
  await prisma.providerProfile.delete({ where: { id, userId } });
  await prisma.integrationToken.delete({ where: { userId_provider: {userId, provider} } })
  revalidateTag(`connections:${userId}`);
}