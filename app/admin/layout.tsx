import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // 🔐 Not logged in
  if (!session) {
    redirect("/login");
  }

  // 🔐 Not admin
  if (session.user?.role !== "admin") {
    redirect("/");
  }

  return <>{children}</>;
}
