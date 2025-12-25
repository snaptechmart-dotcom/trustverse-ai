import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role?: string;
      plan?: "FREE" | "PRO";
    };
  }

  interface User {
    role?: string;
    plan?: "FREE" | "PRO";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
    plan?: "FREE" | "PRO";
  }
}
