import "server-only";
import { unstable_cache } from "next/cache";
import { awsGet } from "../aws/awsDb";

export type ConnectionRow = {
  id: string;
  userId: string;
  provider: string;
  username: string;
  image: string | null;
  createdAt: string; // ISO string
  
};

export type TransferRow = {
  id: string;
  status: string;
  createdAt: string; // ISO string
  source: string;
  dest: string;
  srcPlaylistName: string | null;
  destPlaylistName: string | null;
};

export const getConnections = (userId: string) =>
  unstable_cache(
    async () =>
      awsGet<ConnectionRow[]>("/users/connections", { userId }),
    ["connections", userId],
    { revalidate: 60, tags: [`connections:${userId}`] }
  )();

export const getRecentTransfers = (userId: string, limit: number = 10) =>
  unstable_cache(
    async () =>
      awsGet<TransferRow[]>("/users/recent-transfers", { userId, limit }),
    ["transfers", userId],
    { revalidate: 60, tags: [`transfers:${userId}`] }
  )();
