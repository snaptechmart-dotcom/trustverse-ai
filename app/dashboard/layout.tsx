import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
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
    <div className="flex min-h-screen bg-gray-50 overflow-x-hidden">
      {/* SIDEBAR — FULL HEIGHT */}
      <aside className="min-h-screen">
        <Sidebar />
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 min-h-screen px-6 py-6">
        <SessionWatcher />

        <div className="max-w-6xl min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
