import NextAuth from "next-auth";
import type { Provider } from "next-auth/providers"

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    batonUserId?: string,
    provider?: string,
    providerAccountId?: string,
    revoked?: boolean,
    tokenLastChecked: number,
  }
}