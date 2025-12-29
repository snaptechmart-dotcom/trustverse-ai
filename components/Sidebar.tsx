"use client";

import { useState } from "react";
import Link from "next/link";
import { HiMenu, HiX } from "react-icons/hi";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const NavLink = ({
    href,
    label,
  }: {
    href: string;
    label: string;
  }) => (
    <Link
      href={href}
      onClick={() => setOpen(false)}   // 🔥 AUTO CLOSE
      className={`block ${
        pathname === href ? "text-blue-400" : "hover:text-blue-400"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <>
      {/* MOBILE TOP BAR */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-gray-900 text-white">
        <span className="font-bold">Trustverse AI</span>
        <button onClick={() => setOpen(true)}>
          <HiMenu size={26} />
        </button>
      </div>

      {/* OVERLAY */}
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
          lg:translate-x-0
        `}
      >
        {/* MOBILE CLOSE */}
        <div className="flex items-center justify-between px-4 py-3 lg:hidden">
          <span className="font-bold">Trustverse AI</span>
          <button onClick={() => setOpen(false)}>
            <HiX size={22} />
          </button>
        </div>

        {/* BRAND */}
        <div className="px-4 pt-6 pb-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold">Trustverse AI</h2>
        </div>

        {/* NAV */}
        <nav className="px-4 mt-6 space-y-4">
          <NavLink href="/dashboard" label="Dashboard" />
          <NavLink href="/dashboard/tools" label="AI Tools" />
          <NavLink href="/dashboard/history" label="History" />
          <NavLink href="/dashboard/settings" label="Settings" />
        </nav>
      </aside>
    </>
  );
}
