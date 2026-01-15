"use server"

import listTransfers from "@/lib/transfers/listTransfers";

export default async function loadTransfers(input: { userId: string, cursor: string }) {
    const { userId, cursor } = input;
    return await listTransfers(userId, cursor);
}