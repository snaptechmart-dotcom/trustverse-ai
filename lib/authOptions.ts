import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        // 🔐 HARD GUARD (NO TS ERROR, NO RUNTIME ERROR)
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email.trim().toLowerCase();

        const user = await prisma.user.findUnique({
          where: { email },
          select: {
            id: true,
            email: true,
            password: true,
            plan: true,
            credits: true,
          },
        });

        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) return null;

        // ✅ RETURN ONLY SAFE FIELDS (JWT COMPATIBLE)
        return {
          id: user.id,
          email: user.email,
          plan: user.plan ?? "free",
          credits: user.credits ?? 0,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },

  callbacks: {
    // 🔐 JWT CALLBACK (INITIAL LOGIN DATA)
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.plan = user.plan;
        token.credits = user.credits;
      }
      return token;
    },

    // 🔁 SESSION CALLBACK (ALWAYS FRESH DATA FROM DB)
    async session({ session, token }) {
      if (!session.user?.email) return session;

      const dbUser = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: {
          id: true,
          email: true,
          plan: true,
          credits: true,
        },
      });

      if (!dbUser) return session;

      session.user.id = dbUser.id;
      session.user.email = dbUser.email;
      session.user.plan = (dbUser.plan ?? "free").toLowerCase();
      session.user.credits = dbUser.credits ?? 0;

      return session;
    },
  },
};
