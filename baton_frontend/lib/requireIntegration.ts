import { redirect } from "next/navigation";
import { prisma } from "./prisma";
import { OAUTH } from "@/integrations/providers";

export const runtime = "nodejs";

export default async function requireIntegration (
    userId: string, provider: string, returnTo: string
): Promise<string | void> {
    
    const token = await prisma.integrationToken.findUnique({
        where: { userId_provider: { userId, provider } },
        select: { access_token: true, refresh_token: true, expires_at: true }
    })
    if (!token) {
        redirect(`/api/oauth/${provider}/start?return_to=${returnTo}`)
    }
    const now = Math.floor(Date.now() / 1000);
    if (token.expires_at > now + 60) return token.access_token;
    const cfg = OAUTH[provider];
    const clientId = cfg.clientId;
    const tokenUrl = cfg.tokenUrl;
    
    const body = new URLSearchParams({
        client_id: clientId,
        grant_type: "refresh_token",
        refresh_token: token.refresh_token,
    })

    if (cfg.clientSecret) {
        body.append("client_secret", cfg.clientSecret);
    }

    const tokenResp = await fetch(tokenUrl, {
        method: "POST",
        headers: {"content-type": "application/x-www-form-urlencoded"},
        body,
    });
    if (!tokenResp.ok) {
        if (tokenResp.status === 400) {
            redirect(`/api/oauth/${provider}/start?return_to=${returnTo}`)
        }
    }
}