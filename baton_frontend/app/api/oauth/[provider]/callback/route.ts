import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { OAUTH } from "@/integrations/providers";
import { revalidateTag, revalidatePath } from "next/cache";

export const runtime = "nodejs";

type StatePayload = { n: string; r: string };

function b64urlDecode(s: string) {
  s = s.replace(/-/g, "+").replace(/_/g, "/");
  const pad = s.length % 4 ? 4 - (s.length % 4) : 0;
  return Buffer.from(s + "=".repeat(pad), "base64").toString();
}

export async function GET(request: Request, { params }: {params: Promise<{ provider: string }> }) {
    const url = new URL(request.url);
    const { provider } = await params;
    const cfg = OAUTH[provider];
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const error = url.searchParams.get("error");
    const store = await cookies();
    const cookieState = store.get(`${provider}_oauth_state`)?.value;
    const codeVerifier = store.get(`${provider}_pkce_verifier`)?.value;
    const tokenUrl = cfg.tokenUrl;
    if (error === "access_denied") {
        return NextResponse.redirect(new URL("/transfer/denied", url.origin));
    }
    if (!code || !state) {
        return NextResponse.redirect(new URL("/transfer?error=oauth_missing_params", url.origin));
    }
    if (cookieState !== state) {
        return NextResponse.redirect(new URL("/transfer?error=oauth_state_mismatch", url.origin));
    }
    if (!codeVerifier) {
        return NextResponse.redirect(new URL("/transfer?error=pkce_missing", url.origin));
    }

    let returnTo = "/transfer";

    try {
        const payload = JSON.parse(b64urlDecode(state)) as StatePayload;
        if (payload.r?.startsWith("/")) returnTo = payload.r;
    } catch { };

    const session = await getServerSession(authOptions);

    if (!session) {
        const signin = new URL("/api/auth/signin", url.origin);
        signin.searchParams.set("callbackUrl", returnTo);
        return NextResponse.redirect(signin);
    }
    const userId = session.user.id;

    const clientId = cfg.clientId;
    const redirectUri = `${url.origin}/api/oauth/${provider}/callback`;

    const body = new URLSearchParams({
        client_id: clientId,
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
        code_verifier: codeVerifier,
    });
    if (cfg.clientSecret) {
        body.append("client_secret", cfg.clientSecret);
    }

    const tokenResp = await fetch(tokenUrl, {
        method: "POST",
        headers: {"content-type": "application/x-www-form-urlencoded"},
        body,
    })
    
    if (!tokenResp.ok) {
        return NextResponse.redirect(new URL("/transfer?error=token_exchange_failed", url.origin));
    }

    const tokenJson = await tokenResp.json() as {
        access_token: string;
        refresh_token: string;
        expires_in: number;
        scope?: string;
        token_type: string;
    };

    const expires_at = Math.floor(Date.now() / 1000) + (tokenJson.expires_in ?? 3600);

    const profileRow = await prisma.providerProfile.findUnique({
        where: { userId_provider: { userId, provider } }
    })

    if (profileRow === null) {
        const ytUrl = "https://www.googleapis.com/oauth2/v1/userinfo?alt=json";
        const spotifyUrl = "https://api.spotify.com/v1/me";

        const profileRes = await fetch(
            provider == "ytmusic" ? ytUrl : spotifyUrl, {
                headers: {
                    Authorization: `Bearer ${tokenJson.access_token}`,
                    'Content-Type': 'application/json',
                },
            }
        )
        const profileJson = await profileRes.json();
        const profile = {
            id: profileJson.id,
            image: provider == "ytmusic" ? profileJson.picture : profileJson.images[0].url,
            display_name: provider == "ytmusic" ? profileJson.name : profileJson.display_name ?? `${provider} username`,
        }
        await prisma.providerProfile.create({
            data: {
                userId,
                provider,
                providerId: profile.id,
                username: profile.display_name,
                image: profile.image,
            }
        })
    }


    await prisma.integrationToken.upsert({
        where: { userId_provider: { userId, provider: provider} },
        update: {
            access_token: tokenJson.access_token,
            refresh_token: tokenJson.refresh_token,
            expires_at,
        },
        create: {
            userId,
            provider: provider,
            access_token: tokenJson.access_token,
            refresh_token: tokenJson.refresh_token,
            expires_at,
        }
    });

    const res = NextResponse.redirect(new URL(returnTo, url.origin));
    res.cookies.delete(`${provider}_oauth_state`);
    res.cookies.delete(`${provider}_pkce_verifier`);

    await revalidateTag(`connections:${userId}`);
    await revalidatePath(returnTo);

    return res;
}