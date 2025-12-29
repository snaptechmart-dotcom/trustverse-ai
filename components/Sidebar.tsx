"use client";

import { useState } from "react";
import Link from "next/link";
import { HiMenu, HiX } from "react-icons/hi";

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* MOBILE TOP BAR */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-gray-900 text-white">
        <span className="font-bold">Trustverse AI</span>
        <button onClick={() => setOpen(true)}>
          <HiMenu size={26} />
        </button>
      </div>

      {/* OVERLAY (mobile only) */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-gray-900 text-white
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static
          hidden lg:block
        `}
      >
        {/* MOBILE HEADER INSIDE SIDEBAR */}
        <div className="flex items-center justify-between p-4 lg:hidden">
          <span className="font-bold">Trustverse AI</span>
          <button onClick={() => setOpen(false)}>
            <HiX size={24} />
          </button>
        </div>

        {/* BRAND */}
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Trustverse AI</h2>
          <hr className="border-gray-700 mb-4" />
        </div>

        {/* NAV */}
        <nav className="px-4 space-y-4">
          <Link href="/dashboard" className="block hover:text-blue-400">
            Dashboard
          </Link>

          <Link href="/dashboard/tools" className="block hover:text-blue-400">
            AI Tools
          </Link>

          <Link href="/dashboard/history" className="block hover:text-blue-400">
            History
          </Link>

          <Link href="/dashboard/settings" className="block hover:text-blue-400">
            Settings
          </Link>
        </nav>
      </aside>
    </>
  );
}
