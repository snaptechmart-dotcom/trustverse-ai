"use client";

import { useState } from "react";
import Link from "next/link";
import { HiMenu } from "react-icons/hi";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* SIDEBAR */}
      <aside
        className={`fixed md:static z-40 w-64 bg-[#061826] text-white transform transition-transform duration-200
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="p-4 font-bold text-lg border-b border-white/10">
          Trustverse AI
        </div>

        <nav className="p-4 space-y-2">
          <Link
            href="/dashboard"
            className="block px-3 py-2 rounded hover:bg-white/10"
            onClick={() => setSidebarOpen(false)}
          >
            Dashboard
          </Link>

          <Link
            href="/dashboard/history"
            className="block px-3 py-2 rounded hover:bg-white/10"
            onClick={() => setSidebarOpen(false)}
          >
            History
          </Link>

          <Link
            href="/dashboard/settings"
            className="block px-3 py-2 rounded hover:bg-white/10"
            onClick={() => setSidebarOpen(false)}
          >
            Settings
          </Link>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col">
        {/* TOP BAR (SIDEBAR HAMBURGER) */}
        <div className="flex items-center gap-2 p-3 border-b bg-white md:hidden">
          {/* 🔥 FIX: SIDEBAR HAMBURGER — DESKTOP ONLY */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden md:flex p-2 rounded border"
          >
            <HiMenu />
          </button>

          <span className="font-semibold">Dashboard</span>
        </div>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
