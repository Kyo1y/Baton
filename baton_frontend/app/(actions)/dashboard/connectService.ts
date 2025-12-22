"use server"

import { redirect } from "next/navigation";

export function connectService(provider: string) {
    
    redirect(`/api/oauth/${provider}/start?return_to=/dashboard`);
}