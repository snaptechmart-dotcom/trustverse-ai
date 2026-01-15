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
    // ✅ LOGIN / SIGNUP
    async signIn({ user }) {
      await dbConnect();

      let dbUser = await User.findOne({ email: user.email });

      if (!dbUser) {
        dbUser = await User.create({
          email: user.email,
          name: user.name,
          credits: 0,
        });
      }

      return true;
    },

    // ✅ JWT = DB USER ID ATTACH
    async jwt({ token, user }) {
      if (user?.email) {
        await dbConnect();
        const dbUser = await User.findOne({ email: user.email });
        if (dbUser) {
          token.id = dbUser._id.toString(); // 🔥 MOST IMPORTANT
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
