"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { HiMenu, HiX } from "react-icons/hi";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [credits, setCredits] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // 🔄 Fetch credits (FIXED API)
  const fetchCredits = async () => {
    try {
      const res = await fetch("/api/check-credits");
      const data = await res.json();
      setCredits(data.credits ?? 0);
    } catch {
      console.error("Failed to load credits");
    }
  };

  useEffect(() => {
    if (status === "authenticated") fetchCredits();
  }, [status]);

  return (
    <nav className="w-full bg-[#061826] border-b border-white/10 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="text-white font-bold text-lg">
          Trustverse AI
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-5">
          <Link href="/pricing" className="text-white/80 hover:text-white">
            Pricing
          </Link>

          <Link href="/tools" className="text-white/80 hover:text-white">
            AI Tools
          </Link>

          {status === "authenticated" && session?.user ? (
            <>
              {/* Credits */}
              <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-sm">
                <span className="opacity-80">Credits:</span>
                <span className="font-bold">
                  {credits !== null ? credits : "..."}
                </span>
              </div>

              <Link
                href="/dashboard"
                className="px-4 py-2 rounded-lg bg-cyan-500 text-black font-semibold"
              >
                Dashboard
              </Link>

              {/* ✅ SETTINGS LINK */}
              <Link
                href="/dashboard/settings"
                className="px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/10"
              >
                Settings
              </Link>

              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="px-4 py-2 rounded-lg bg-red-500 text-white font-semibold"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 rounded-lg bg-cyan-500 text-black font-semibold"
            >
              Login
            </Link>
          )}
        </div>

        {/* MOBILE HAMBURGER */}
        <button
          className="md:hidden text-white text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <HiX /> : <HiMenu />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-4 bg-[#061826] border-t border-white/10 pt-4">
          <Link
            href="/pricing"
            onClick={() => setMenuOpen(false)}
            className="text-white/80"
          >
            Pricing
          </Link>

          <Link
            href="/tools"
            onClick={() => setMenuOpen(false)}
            className="text-white/80"
          >
            AI Tools
          </Link>

          {status === "authenticated" && session?.user ? (
            <>
              <div className="text-white/80 text-sm">
                Credits:{" "}
                <span className="font-bold">
                  {credits !== null ? credits : "..."}
                </span>
              </div>

              <Link
                href="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="text-cyan-400 font-semibold"
              >
                Dashboard
              </Link>

              {/* ✅ SETTINGS LINK (MOBILE) */}
              <Link
                href="/dashboard/settings"
                onClick={() => setMenuOpen(false)}
                className="text-white/80 font-semibold"
              >
                Settings
              </Link>

              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="text-red-400 text-left"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="text-cyan-400 font-semibold"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
