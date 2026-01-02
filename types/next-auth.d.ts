import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      plan: string;
      credits: number;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: string;
    plan: string;
    credits: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    plan: string;
    credits: number;
  }
}
