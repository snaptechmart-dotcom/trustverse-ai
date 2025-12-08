import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },

      async authorize(credentials) {
        // ⭐ Always connect to DB before any query
        await connectDB();

        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        // Find user in DB
        const user = await User.findOne({ email: credentials.email }).lean();

        if (!user) {
          throw new Error("User not found");
        }

        // ⚠ Temporary password check (आप बाद में bcrypt use कर सकते हो)
        const isValid = credentials.password === user.password;

        if (!isValid) {
          throw new Error("Incorrect password");
        }

        // Successfully Logged In
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        };
      }
    })
  ],

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login"
  }
};

// ⭐ Next.js 15 Route Export
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
