"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  if (!pathname) return null;

  return (
    <aside className="h-full w-64 bg-[#061826] text-white p-4 space-y-4">
      <div className="text-lg font-bold border-b border-white/10 pb-3">
        Trustverse AI
      </div>

      <nav className="space-y-1">
        {/* Dashboard */}
        <Link
          href="/dashboard"
          className={`block px-3 py-2 rounded ${
            pathname === "/dashboard"
              ? "bg-white/20"
              : "hover:bg-white/10"
          }`}
        >
          Dashboard
        </Link>

        {/* ✅ AI Tools (NEW) */}
        <Link
          href="/dashboard/tools"
          className={`block px-3 py-2 rounded ${
            pathname.startsWith("/dashboard/tools")
              ? "bg-white/20"
              : "hover:bg-white/10"
          }`}
        >
          AI Tools
        </Link>

        {/* History */}
        <Link
          href="/dashboard/history"
          className={`block px-3 py-2 rounded ${
            pathname.startsWith("/dashboard/history")
              ? "bg-white/20"
              : "hover:bg-white/10"
          }`}
        >
          History
        </Link>

        {/* Settings */}
        <Link
          href="/dashboard/settings"
          className={`block px-3 py-2 rounded ${
            pathname.startsWith("/dashboard/settings")
              ? "bg-white/20"
              : "hover:bg-white/10"
          }`}
        >
          Settings
        </Link>
      </nav>
    </aside>
  );
}
