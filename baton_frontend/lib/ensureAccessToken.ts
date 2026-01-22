import { OAUTH } from "@/integrations/providers";
import { redirect } from "next/navigation";
import { findToken, updateToken } from "./tokens/tokens";


async function readErr(r: Response) {
  try { return await r.json(); } catch { return { error: await r.text() }; }
}

export default async function ensureAccessToken(userId: string, provider: string) {
    const token = await findToken(userId, provider);
    if (!token) {
        redirect(`/api/oauth/${provider}/start?return_to=/transfer`);
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
        const err = await readErr(tokenResp);
        if (tokenResp.status === 400) {
            redirect(`/api/oauth/${provider}/start?return_to=/transfer`);
        }
        else {
            throw new Error(`TOKEN_REFRESH_FAILED ${tokenResp.status}: ${JSON.stringify(err)}`);
        }
    }
    const tokenJson = await tokenResp.json() as {access_token: string, refresh_token?: string, expires_in: number}
    const newAccessToken = tokenJson.access_token;
    const newRefresh = tokenJson.refresh_token ?? token.refresh_token;
    const newExpiry = Math.floor(Date.now()/1000) + tokenJson.expires_in;

    await updateToken(userId, provider, newAccessToken, newRefresh, newExpiry);

    return newAccessToken;
    
}
    