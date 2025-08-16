import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
    secret: process.env.AUTH_SECRET,
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

};
console.log(
  "[NextAuth env]",
  "NEXTAUTH_URL=" + JSON.stringify(process.env.NEXTAUTH_URL),
  "NEXTAUTH_SECRET.len=" + (process.env.AUTH_SECRET?.length ?? 0)
);
export default NextAuth(authOptions);