"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { signOut } from "next-auth/react";
import { HiMenu, HiX } from "react-icons/hi";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [open, setOpen] = useState(false);

  // ✅ AUTO-OPEN SIDEBAR ON MOBILE WHEN ?menu=open
  useEffect(() => {
    if (searchParams.get("menu") === "open") {
      setOpen(true);
    }
  }, [searchParams]);

  const navItem = (href: string, label: string) => (
    <Link
      href={href}
      onClick={() => setOpen(false)}
      className={`block px-4 py-2 rounded-md text-sm transition ${
        pathname === href
          ? "bg-white/10 text-blue-400"
          : "text-gray-200 hover:bg-white/10"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <>
      {/* ================= MOBILE TOP BAR ================= */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-[#0B1220] flex items-center justify-between px-4">
        <button
          onClick={() => router.push("/dashboard")}
          className="text-white font-semibold"
        >
          Trustverse AI
        </button>

        <button onClick={() => setOpen(true)} className="text-white">
          <HiMenu size={26} />
        </button>
      </div>

      {/* ================= MOBILE OVERLAY ================= */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`
          fixed lg:static
          top-0 left-0 z-50
          h-full lg:h-screen
          w-64
          bg-[#0B1220]
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
          flex flex-col
        `}
      >
        {/* HEADER */}
        <div className="h-14 flex items-center justify-between px-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="text-white font-semibold text-lg"
          >
            Trustverse AI
          </button>

          <button
            onClick={() => setOpen(false)}
            className="lg:hidden text-white"
          >
            <HiX size={22} />
          </button>
        </div>

        {/* NAV */}
        <nav className="px-2 space-y-1 mt-2">
          {navItem("/dashboard", "Dashboard")}
          {navItem("/dashboard/tools", "AI Tools")}
          {navItem("/dashboard/history", "History")}
          {navItem("/dashboard/payments", "Payment History")}
          {navItem("/dashboard/settings", "Settings")}

          <div className="mt-1">
            <Link
              href="/dashboard/profile"
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10 rounded-md"
            >
              Profile / Account
            </Link>

            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/10 rounded-md"
            >
              Logout
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
}
