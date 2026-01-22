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
            if (!token.batonUserId) {
                const provider = account?.provider;
                const providerAccountId = account?.providerAccountId;

                const email = user?.email;
                const name = user?.name;
                const image = user?.image;

                if (provider && providerAccountId) {
                    const res = await fetch(`${process.env.AWS_API_URL}/auth/upsert-user`, {
                        method: "POST",
                        headers: {
                            "content-type": "application/json",
                            "x-api-key": process.env.AWS_API_KEY!,
                        },
                        body: JSON.stringify({ account, email, name, image })
                    })

                    const data = await res.json();
                    token.batonUserId = data.userId;
                }
            }
            return token;
        }
        ,
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.batonUserId;
            }
            return session;
        },
    },
} satisfies NextAuthOptions;

export default NextAuth(authOptions);