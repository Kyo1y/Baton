import { NextResponse } from "next/server";
import crypto from "crypto";
import { OAUTH } from "@/integrations/providers";

export const runtime = "nodejs";

function sha256(verifier: string) {
    return crypto.createHash("sha256").update(verifier).digest();
}

function base64url(input: Buffer) {
  return input
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function sanitizeReturnTo(rt: string | null) {
  if (!rt) return "/transfer";
  try {
    if (!rt.startsWith("/")) return "/transfer";
        return rt;
  } catch {
        return "/transfer";
  }
}


export async function GET(request: Request, { params }: { params: Promise<{ provider: string }> }) {
    const url = new URL(request.url);
    const { provider } = await params;
    const cfg = OAUTH[provider];
    if (!cfg) return NextResponse.json({ error: "unknown provider" }, { status: 404 });
    const scope = cfg.scopes.join(" ");
    const redirectUri = `${url.origin}/api/oauth/${provider}/callback`;
    const clientId = cfg.clientId;
    const returnTo = sanitizeReturnTo(url.searchParams.get("return_to"));
    const codeVerifier = base64url(crypto.randomBytes(64));
    const codeChallenge = base64url(sha256(codeVerifier));

    const nonce = base64url(crypto.randomBytes(16));
    const statePayload = { n: nonce, r: returnTo };
    const state = base64url(Buffer.from(JSON.stringify(statePayload)));

    const authUrl = new URL(cfg.authorizeUrl);
    const paramsUrl = {
        response_type: "code",
        client_id: clientId,
        scope,
        state,
        code_challenge_method: "S256",
        code_challenge: codeChallenge,
        redirect_uri: redirectUri,
        access_type: "offline",
        prompt: "consent",
    }
    authUrl.search = new URLSearchParams(paramsUrl).toString();

    const res = NextResponse.redirect(authUrl);
    const cookieOpts = {
        httpOnly: true as const,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const,
        path: "/",
        maxAge: 10 * 60,
    }
    res.cookies.set(`${provider}_oauth_state`, state, cookieOpts);
    res.cookies.set(`${provider}_pkce_verifier`, codeVerifier, cookieOpts);

    return res;
}