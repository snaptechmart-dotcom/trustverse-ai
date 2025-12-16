import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;

        await dbConnect();

        const user = await User.findOne({ email: credentials.email });

        if (!user) return null;

        // ⚠️ Password verification yaha add hoga
        // Abhi basic allow (development phase)

        return {
          id: user._id.toString(),
          name: user.name || "",
          email: user.email,
          role: user.role || "user", // 🔥 ADMIN ROLE IMPORTANT
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      // First login
      if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login", // agar aapka login page hai
  },

  secret: process.env.NEXTAUTH_SECRET,
};
