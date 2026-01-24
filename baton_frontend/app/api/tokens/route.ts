export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    const { userId, provider, accessToken, refreshToken, expiresAt } = await req.json();

    if (!userId || !provider || !accessToken || !expiresAt) {
        return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const telegramId = String(userId);
    const providerAccountId = telegramId;

    await prisma.user.upsert({
        where: { telegramId },
        create: { telegramId },
        update: {}
    })
    await prisma.account.upsert({
        where: { provider_providerAccountId: { provider, providerAccountId } },
        create: {
            type: 'oauth',
            provider,
            providerAccountId,
            access_token: accessToken,
            refresh_token: refreshToken,
            expires_at: Math.floor(expiresAt),
            user: { connect: { telegramId } },
            token_type: 'Bearer'
        },
        update: {
            access_token: accessToken,
            refresh_token: refreshToken,
            expires_at: typeof expiresAt === 'number' ? Math.floor(expiresAt) : null,
            token_type: 'Bearer'
        }
  });

  return NextResponse.json({ ok: true });

}