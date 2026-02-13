import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    session: { strategy: "jwt" },
    providers: [
        GitHubProvider({
            clientId: process.env.AUTH_GITHUB_ID!,
            clientSecret: process.env.AUTH_GITHUB_SECRET!,
        }),
        Google({
            clientId: process.env.AUTH_GOOGLE_ID!,
            clientSecret: process.env.AUTH_GOOGLE_SECRET!,
        }),
    ],
    callbacks: {
        async jwt({ token, user, account }) {
            const now = Math.floor(Date.now() / 1000);
            const REVOCATION_CHECK = 60 * 60 * 24 * 15;
            if (!token.batonUserId && account && user) {
                const provider = account.provider;
                const providerAccountId = account.providerAccountId;
                const email = user.email;
                const name = user.name;
                const image = user.image;

                if (provider && providerAccountId) {
                    account.session_state = "active";
                    const res = await fetch(`${process.env.AWS_API_URL}/auth/upsert-user`, {
                        method: "POST",
                        headers: {
                            "content-type": "application/json",
                            "x-api-key": process.env.AWS_API_KEY!,
                        },
                        body: JSON.stringify({ account, email, name, image })
                    })
                    const data = await res.json();
                    token.provider = provider;
                    token.providerAccountId = providerAccountId;
                    token.batonUserId = data.userId;
                    token.tokenLastChecked = now;
                    token.revoked = false;
                }
            }
            
            if (token.provider && token.providerAccountId && (token.tokenLastChecked + REVOCATION_CHECK <= now)) {
                const url = new URL("/auth/check-token", process.env.AWS_API_URL);
                url.searchParams.set("provider", token.provider);
                url.searchParams.set("providerAccountId", token.providerAccountId);

                const res = await fetch(url.toString(), {
                    method: "GET",
                    headers: {
                        "x-api-key": process.env.AWS_API_KEY!,
                    },
                });

                if (res.ok) {
                    const data = await res.json();
                    if (data.status === "revoked") {
                        token.revoked = true;
                        const url = new URL("/auth/set-token", process.env.AWS_API_URL);
                        url.searchParams.set("provider", account!.provider);
                        url.searchParams.set("providerAccountId", account!.providerAccountId);
                        url.searchParams.set("session_state", "active");

                        const res = await fetch(url.toString(), {
                            method: "POST",
                            headers: {
                                "x-api-key": process.env.AWS_API_KEY!,
                            },
                        });

                        if (!res.ok) { 
                            throw new Error("Session revalidation failed")
                        }
                    };
                }
            }
            return token; 
        }
        ,
        async session({ session, token }) {
            if (token.revoked) {
                return { ...session, user: undefined as any };
            }

            if (session.user) {
                (session.user as any).id = token.batonUserId;
            }
            return session;
        },
        async signIn({ account }) {
            // -----------
            // RATE-LIMIT?
            // -----------
            if (account?.provider === "google") {

                const url = new URL("/auth/check-token", process.env.AWS_API_URL);
                url.searchParams.set("provider", account.provider);
                url.searchParams.set("providerAccountId", account.providerAccountId);

                const res = await fetch(url.toString(), {
                    method: "GET",
                    headers: {
                        "x-api-key": process.env.AWS_API_KEY!,
                    },
                });

                if (res.ok) {
                    const data = await res.json();
                    if (data.status === "disabled") return false;
                }
                if (!res.ok) {
                    throw new Error("Could not validate account.")
                }
                return true;
            }
            return true;
        }
    },
} satisfies NextAuthOptions;

export default NextAuth(authOptions);