import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/app/lib/mongodb";
import User from "@/app/models/User";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        await connectDB();

        const user = await User.findOne({ email: credentials.email });
        if (!user) return null;

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
});

// ✅ Sir DEKH LO — Yahaan koi authOptions export NAHI HO RAHA
export { handler as GET, handler as POST };
