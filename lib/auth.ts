import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    // ✅ LOGIN / SIGNUP (GOOGLE)
    async signIn({ user }) {
      if (!user.email) return false;

      const email = user.email.toLowerCase();

      let dbUser = await prisma.user.findUnique({
        where: { email },
      });

      if (!dbUser) {
        await prisma.user.create({
          data: {
            email,
            password: "GOOGLE_AUTH", // dummy (required field)
            credits: 0,
            plan: "free",
          },
        });
      }

      return true;
    },

    // ✅ JWT = USER ID ATTACH
    async jwt({ token, user }) {
      if (user?.email) {
        const email = user.email.toLowerCase();

        const dbUser = await prisma.user.findUnique({
          where: { email },
        });

        if (dbUser) {
          token.id = dbUser.id; // 🔥 MOST IMPORTANT
        }
      }
      return token;
    },

    // ✅ SESSION = USER ID EXPOSE
    async session({ session, token }) {
      if (session.user && token.id) {
        // @ts-ignore
        session.user.id = token.id;
      }
      return session;
    },
  },
};
