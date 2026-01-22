"use server";
import { revalidateTag } from "next/cache";
import { deleteToken } from "@/lib/tokens/tokens";
import { deleteProviderProfile } from "@/lib/providerProfile/awsProviderProfile";

export async function disconnectService(id: string, userId: string, provider: string) {
  await deleteToken(userId, provider);
  await deleteProviderProfile(userId, provider)
  revalidateTag(`connections:${userId}`);
}