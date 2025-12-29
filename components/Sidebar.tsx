"use client";

import { useState } from "react";
import Link from "next/link";
import { HiMenu, HiX } from "react-icons/hi";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { status } = useSession();

  const NavLink = ({
    href,
    label,
  }: {
    href: string;
    label: string;
  }) => (
    <Link
      href={href}
      onClick={() => setOpen(false)}
      className={`block ${
        pathname === href
          ? "text-blue-400 font-medium"
          : "text-gray-200 hover:text-blue-400"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <>
      {/* 🔹 MOBILE TOP BAR */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-gray-900 text-white">
        <button
          onClick={() => {
            setOpen(false);
            router.push("/dashboard");
          }}
          className="font-bold"
        >
          Trustverse AI
        </button>

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

      {/* 🔹 SIDEBAR */}
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

        {/* 🔹 DESKTOP BRAND (THIS WAS MISSING ✅ FIXED) */}
        <div className="hidden lg:block px-4 py-4 border-b border-white/10">
          <span className="text-lg font-semibold">Trustverse AI</span>
        </div>

        {/* MAIN NAV */}
        <nav className="px-4 mt-6 space-y-4">
          <NavLink href="/dashboard" label="Dashboard" />
          <NavLink href="/dashboard/tools" label="AI Tools" />
          <NavLink href="/dashboard/history" label="History" />
          <NavLink href="/dashboard/settings" label="Settings" />
        </nav>

        {/* 🔥 MOBILE USER ACTIONS */}
        {status === "authenticated" && (
          <div className="lg:hidden mt-8 border-t border-white/10 pt-4 px-4 space-y-4">
            <button
              onClick={() => {
                setOpen(false);
                router.push("/dashboard/settings");
              }}
              className="block w-full text-left hover:text-blue-400"
            >
              Profile / Account
            </button>

            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="block w-full text-left text-red-400 hover:text-red-300"
            >
              Logout
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
