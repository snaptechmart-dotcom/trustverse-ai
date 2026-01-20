import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      plan: string;
      credits: number;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    plan: string;
    credits: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    plan: string;
    credits: number;
  }
}
