"use server"

import { redirect } from "next/navigation";
import { revalidateTag } from "next/cache";

export function connectService(provider: string) {
    
    redirect(`/api/oauth/${provider}/start?return_to=/dashboard`);
}