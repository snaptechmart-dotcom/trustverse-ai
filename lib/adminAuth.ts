import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function requireAdmin() {
  const session = await getServerSession(authOptions);

 if (!session || !session.user || (session.user as any).role !== "admin") {

    throw new Error("Unauthorized");
  }

  return session;
}
