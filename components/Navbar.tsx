"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  const isPro = session?.user?.plan === "PRO";

  return (
    <header className="w-full bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="text-lg font-semibold">
          Trustverse AI
        </Link>

        {/* Right Side */}
        {status === "authenticated" ? (
          <div className="flex items-center gap-4 relative">

            {/* Upgrade / Pro */}
            {isPro ? (
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-100 text-indigo-700">
                PRO
              </span>
            ) : (
              <Link
                href="/pricing"
                className="text-sm font-medium px-4 py-1.5 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition"
              >
                Upgrade to Pro
              </Link>
            )}

            {/* User Avatar */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold"
            >
              {session.user.email?.[0]?.toUpperCase()}
            </button>

            {/* Dropdown */}
            {menuOpen && (
              <div className="absolute right-0 top-11 bg-white border rounded-md shadow-md w-40">
                <Link
                  href="/dashboard"
                  className="block px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut()}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-600"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/login"
            className="text-sm font-medium px-4 py-1.5 rounded-md bg-indigo-600 text-white"
          >
            Login
          </Link>
        )}
      </div>
    </header>
  );
}
