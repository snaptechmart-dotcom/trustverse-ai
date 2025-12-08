import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/app/lib/mongodb";
import User from "@/app/models/User";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        await connectDB();

        const user = await User.findOne({ email: credentials.email });
        if (!user) return null;

        // ⚠️ यदि आपके DB में password hashed नहीं है — बाद में हम hashing जोड़ देंगे।
        const isValid = credentials.password === user.password;
        if (!isValid) return null;

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],

  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
};

// ✅ App Router compliant NextAuth handler
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
export default handler;   // ⭐ Required for Vercel + TS builds
