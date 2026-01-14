import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import dbConnect from "@/lib/db";
import User from "@/models/User";

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
    async signIn({ user }) {
      await dbConnect();

      const existingUser = await User.findOne({ email: user.email });

      if (!existingUser) {
        // ✅ FIRST TIME USER ONLY
        await User.create({
          email: user.email,
          name: user.name,
          credits: 0, // ❗ NO BONUS CREDIT HERE
        });
      }

      return true;
    },

    async jwt({ token }) {
      return token;
    },

    async session({ session }) {
      // ❌ NO CREDIT LOGIC HERE
      return session;
    },
  },
};
