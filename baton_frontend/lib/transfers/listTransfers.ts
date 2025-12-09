import { prisma } from "@/lib/prisma";

export default async function listTransfers(userId: string, cursor?: { id: string }, limit: number = 10) {
    const rows = await prisma.transferDraft.findMany({
        where: { userId },
        orderBy: [{createdAt: "desc"}],
        take: limit + 1,
        ...(cursor ? { cursor, skip: 1 } : {}),
        select: { id: true, status: true, createdAt: true, source: true, dest: true, srcPlaylistName: true, destPlaylistName: true },
    });

    const hasMore = rows.length > limit;
    const items = hasMore ? rows.slice(0, limit) : rows;
    const nextCursor = hasMore ? { id: items[items.length - 1].id } : null;

    return { items, nextCursor, hasMore };
}