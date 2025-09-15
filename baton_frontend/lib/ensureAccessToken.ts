import { OAUTH } from "@/integrations/providers";
import { prisma } from "./prisma";
import requireIntegration from "./requireIntegration";

async function readErr(r: Response) {
  try { return await r.json(); } catch { return { error: await r.text() }; }
}

async function cachedToken( userId: string, provider: string) {
    const row = await prisma.integrationToken.findUnique({
        where: { userId_provider: { userId, provider } },
        select: { access_token: true, refresh_token: true, expires_at: true },
    });
    if (!row) {
        throw new Error("MISSING TOKEN");
    }
    const now = Math.floor(Date.now() / 1000);
    if (row.expires_at > now + 60) return row.access_token;
}

export default async function ensureAccessToken(userId: string, provider: string) {
    const row = await prisma.integrationToken.findUnique({
        where: { userId_provider: { userId, provider } },
        select: { access_token: true, refresh_token: true, expires_at: true },
    });

    if (!row) {
        throw new Error("MISSING TOKEN: might be requireIntegration faulter")
    }
    const now = Math.floor(Date.now() / 1000);
    if (row.expires_at > now + 60) return row.access_token;
    const cfg = OAUTH[provider];
    const clientId = cfg.clientId;
    const tokenUrl = cfg.tokenUrl;
    
    const body = new URLSearchParams({
        client_id: clientId,
        grant_type: "refresh_token",
        refresh_token: row.refresh_token,
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
        const err = await readErr(tokenResp);
        throw new Error(`TOKEN_REFRESH_FAILED ${tokenResp.status}: ${JSON.stringify(err)}`);
    }
    const tokenJson = await tokenResp.json() as {access_token: string, refresh_token?: string, expires_in: number}
    const newAccessToken = tokenJson.access_token;
    const newRefresh = tokenJson.refresh_token ?? row.refresh_token;
    const newExpiry = Math.floor(Date.now()/1000) + tokenJson.expires_in;

    await prisma.integrationToken.update({
        where: {userId_provider: { userId, provider }},
        data: {
            access_token: newAccessToken,
            refresh_token: newRefresh,
            expires_at: newExpiry,
        }
    })

    return newAccessToken;
    
}
    