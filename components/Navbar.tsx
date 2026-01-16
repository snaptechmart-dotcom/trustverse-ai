"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [credits, setCredits] = useState<number | null>(null);
  const [plan, setPlan] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const fetchCredits = async () => {
    if (!session?.user) return;
    const res = await fetch("/api/credits", { cache: "no-store" });
    if (!res.ok) return;
    const data = await res.json();
    setCredits(data.credits ?? null);
    setPlan(data.plan ?? null);
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchCredits();
    }
  }, [status]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-[#0B1220] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">

        {/* LOGO */}
        <button
          onClick={() => router.push("/")}
          className="text-white text-lg font-semibold"
        >
          Trustverse AI
        </button>

        {status === "authenticated" ? (
          <div className="flex items-center gap-4 relative" ref={menuRef}>

            {/* CREDITS / PLAN */}
            {plan === "PRO" ? (
              <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                PRO · Unlimited
              </span>
            ) : (
              <span className="text-xs px-3 py-1 rounded-full border border-white/20 text-gray-200">
                Credits: <strong>{credits ?? 0}</strong>
              </span>
            )}

            {plan !== "PRO" && (
              <Link
                href="/pricing"
                className="text-xs px-3 py-1 rounded-md bg-indigo-600 text-white"
              >
                Upgrade
              </Link>
            )}

            {/* AVATAR */}
            <button
              onClick={() => setMenuOpen(v => !v)}
              className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold"
            >
              {session.user?.email?.[0]?.toUpperCase() ?? "U"}
            </button>

            {/* DROPDOWN (DESKTOP + MOBILE) */}
            {menuOpen && (
              <div className="absolute right-0 top-12 w-44 bg-[#0B1220] border border-white/10 rounded-md shadow-lg">

                {/* ✅ IMPORTANT FIX HERE */}
                <button
                  onClick={() => {
                    setMenuOpen(false);

                    // 🔥 Mobile → open dashboard WITH sidebar
                    if (window.innerWidth < 768) {
                      router.push("/dashboard?menu=open");
                    } else {
                      router.push("/dashboard");
                    }
                  }}
                  className="block w-full px-4 py-2 text-left text-sm text-white hover:bg-white/10"
                >
                  Dashboard
                </button>

                <div className="border-t border-white/10 my-1"></div>

                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="block w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-white/10"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/login"
            className="px-4 py-1.5 rounded-md bg-indigo-600 text-white text-sm"
          >
            Login
          </Link>
        )}
      </div>
    </header>
  );
}
