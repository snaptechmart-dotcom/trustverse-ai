"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [credits, setCredits] = useState<number | null>(null);

  const isPro = session?.user?.plan === "PRO";

  // 🔁 Fetch credits ONLY when logged in & FREE user
  useEffect(() => {
    async function fetchCredits() {
      try {
        const res = await fetch("/api/credits");

        if (!res.ok) {
          setCredits(null);
          return;
        }

        const data = await res.json();
        setCredits(data.credits);
      } catch {
        setCredits(null);
      }
    }

    if (status === "authenticated" && session?.user && !isPro) {
      fetchCredits();
    } else {
      setCredits(null);
    }
  }, [status, session, isPro]);

  return (
    <header className="w-full sticky top-0 z-50 bg-gradient-to-r from-[#0B1220] to-[#111827] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">

        {/* Logo */}
        <Link
          href="/"
          className="text-white text-lg font-semibold tracking-wide"
        >
          Trustverse AI
        </Link>

        {/* Right Side */}
        {status === "authenticated" ? (
          <div className="flex items-center gap-4 relative">

            {/* Credits / Plan */}
            {!isPro && credits !== null && (
              <span className="text-xs text-gray-300">
                Credits: <strong>{credits}</strong>
              </span>
            )}

            {isPro && (
              <span className="text-xs text-emerald-400">
                Unlimited
              </span>
            )}

            {/* Pro / Upgrade */}
            {isPro ? (
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                PRO
              </span>
            ) : (
              <Link
                href="/pricing"
                className="text-sm font-medium px-4 py-1.5 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition shadow"
              >
                Upgrade to Pro
              </Link>
            )}

            {/* User Avatar */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-semibold"
            >
              {session.user.email?.[0]?.toUpperCase()}
            </button>

            {/* Dropdown */}
            {menuOpen && (
              <div className="absolute right-0 top-11 bg-[#0B1220] border border-white/10 rounded-md shadow-lg w-40">
                <Link
                  href="/dashboard"
                  className="block px-4 py-2 text-sm text-white hover:bg-white/10"
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </Link>

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    signOut({ callbackUrl: "/login" });
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/10"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/login"
            className="text-sm font-medium px-4 py-1.5 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Login
          </Link>
        )}
      </div>
    </header>
  );
}
