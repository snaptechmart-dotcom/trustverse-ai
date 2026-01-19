import React from "react";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import Sidebar from "@/components/Sidebar";
import SessionWatcher from "@/components/SessionWatcher";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* SIDEBAR — FIXED HEIGHT */}
      <aside className="h-full shrink-0">
        {/* ✅ PASS SESSION (THIS WAS MISSING) */}
        <Sidebar session={session} />
      </aside>

      {/* MAIN CONTENT — SCROLL AREA */}
      <main className="flex-1 h-full overflow-y-auto px-6 py-6">
        <SessionWatcher />

        <div className="max-w-6xl">
          {children}
        </div>
      </main>
    </div>
  );
}
