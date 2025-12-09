"use server"

import listTransfers from "@/lib/transfers/listTransfers";

export default async function loadTransfers(input: { userId: string, cursor: { id: string }, limit?: number }) {
    const { userId, cursor, limit } = input;
    return await listTransfers(userId, cursor, limit ?? 10);
}