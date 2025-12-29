"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [credits, setCredits] = useState<number | null>(null);
  const [plan, setPlan] = useState<string | null>(null);
  const [loadingCredits, setLoadingCredits] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  // 🔁 Fetch credits
  const fetchCredits = async () => {
    if (!session?.user) return;

    try {
      setLoadingCredits(true);
      const res = await fetch("/api/credits", { cache: "no-store" });
      if (!res.ok) return;

      const data = await res.json();
      setCredits(typeof data.credits === "number" ? data.credits : null);
      setPlan(data.plan ?? null);
    } finally {
      setLoadingCredits(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchCredits();
      window.addEventListener("focus", fetchCredits);
      return () => window.removeEventListener("focus", fetchCredits);
    }
  }, [status]);

  // ✅ Outside click → close dropdown
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ✅ Route change → close dropdown
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const isPro = plan === "pro" || plan === "PRO";

  return (
    <header className="w-full sticky top-0 z-50 bg-gradient-to-r from-[#0B1220] to-[#111827] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">

        {/* ✅ LOGO (NOW CLICKABLE) */}
        <button
          onClick={() => router.push("/dashboard")}
          className="text-white text-lg font-semibold"
        >
          Trustverse AI
        </button>

        {status === "authenticated" ? (
          <div className="flex items-center gap-4 relative" ref={menuRef}>

            {/* PLAN / CREDITS */}
            {loadingCredits ? (
              <span className="text-xs text-gray-400">Loading...</span>
            ) : isPro ? (
              <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                PRO · Unlimited
              </span>
            ) : credits !== null ? (
              <span className="text-xs px-3 py-1 rounded-full border border-white/20 text-gray-200">
                Credits: <strong>{credits}</strong>
              </span>
            ) : null}

            {/* UPGRADE */}
            {!isPro && (
              <Link
                href="/pricing"
                className="text-xs px-3 py-1 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Upgrade
              </Link>
            )}

            {/* AVATAR */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold"
            >
              {session?.user?.email?.[0]?.toUpperCase() ?? "U"}
            </button>

            {/* ✅ DROPDOWN (CLEAN & CORRECT) */}
            {menuOpen && (
              <div className="absolute right-0 top-12 w-48 bg-[#0B1220] border border-white/10 rounded-md shadow-lg overflow-hidden">
                <button
                  onClick={() => router.push("/dashboard")}
                  className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-white/10"
                >
                  Dashboard
                </button>

                <button
                  onClick={() => router.push("/dashboard/settings")}
                  className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-white/10"
                >
                  Profile / Account
                </button>

                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/10"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/login"
            className="text-sm px-4 py-1.5 rounded-md bg-indigo-600 text-white"
          >
            Login
          </Link>
        )}
      </div>
    </header>
  );
}
