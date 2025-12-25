"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  const isPro = session?.user?.plan === "PRO";

  return (
    <nav className="w-full border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        
        {/* Logo */}
        <Link href="/" className="text-xl font-bold">
          Trustverse AI
        </Link>

        {/* Right Side */}
        {status === "authenticated" ? (
          <div className="flex items-center gap-4">

            {/* PRO Badge OR Upgrade Button */}
            {isPro ? (
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                PRO
              </span>
            ) : (
              <Link
                href="/pricing"
                className="px-4 py-1.5 text-sm font-semibold rounded-md border border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition"
              >
                Upgrade to Pro
              </Link>
            )}

            {/* User Menu */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center font-bold"
            >
              {session.user.email?.[0]?.toUpperCase()}
            </button>

            {menuOpen && (
              <div className="absolute right-4 top-14 bg-white border rounded-md shadow-md w-40">
                <Link
                  href="/dashboard"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut()}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/login"
            className="px-4 py-1.5 text-sm font-semibold rounded-md bg-indigo-600 text-white"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
