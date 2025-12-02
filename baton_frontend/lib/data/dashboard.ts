import "server-only";
import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

export const getConnections = (userId: string) => 
    unstable_cache(
        async () => prisma.providerProfile.findMany({
            where: { userId },
            select: { id: true, userId: true, provider: true, username: true, image: true, createdAt: true },
        }),
        ["connections", userId],
        { revalidate: 60, tags: [`connections:${userId}`]}
    )();

export const getRecentTransfers = (userId: string, limit: number = 10) =>
    unstable_cache(
        async () => prisma.transferDraft.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            take: limit,
            select: { id: true, status: true, createdAt: true, source: true, dest: true, srcPlaylistName: true, destPlaylistName: true }
        }),
        ["transfers", userId],
        { revalidate: 60, tags: [`transfers:${userId}`] }
    )();