"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminSidebar() {
  const pathname = usePathname();

  const linkClass = (path: string) =>
    `block px-4 py-2 rounded transition ${
      pathname === path
        ? "bg-orange-600 text-white font-semibold"
        : "text-gray-300 hover:bg-slate-800 hover:text-white"
    }`;

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen">
      {/* HEADER */}
      <div className="p-4 border-b border-slate-700">
        <h2 className="text-lg font-bold text-white">
          Trustverse Admin
        </h2>
      </div>

      {/* NAV */}
      <nav className="p-4 space-y-1 text-sm">
        {/* OLD SYSTEM */}
        <Link
          href="/admin/complaints"
          className={linkClass("/admin/complaints")}
        >
          Complaints
        </Link>

        <Link
          href="/admin/history"
          className={linkClass("/admin/history")}
        >
          History
        </Link>

        {/* SECTION */}
        <div className="mt-4 mb-2 text-xs font-semibold text-gray-400 uppercase">
          AI Scam Reports
        </div>

        {/* NEW AI SYSTEM */}
        <Link
          href="/admin/scam-reports"
          className={linkClass("/admin/scam-reports")}
        >
          Scam Reports
        </Link>

        <Link
          href="/admin/scam-history"
          className={linkClass("/admin/scam-history")}
        >
          Scam Reports History
        </Link>
      </nav>
    </aside>
  );
}
