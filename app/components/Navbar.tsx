"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="w-full bg-[#061826] border-b border-white/10 px-6 py-4 flex items-center justify-between">
      
      {/* LOGO */}
      <Link href="/" className="text-white font-bold text-lg">
        Trustverse AI
      </Link>

      {/* MENU */}
      <div className="flex items-center gap-5">
        <Link href="/pricing" className="text-white/80 hover:text-white">
          Pricing
        </Link>

        <Link href="/tools" className="text-white/80 hover:text-white">
          AI Tools
        </Link>

        {/* AUTH STATE */}
        {status === "authenticated" && session?.user ? (
          <>
            {/* USER EMAIL */}
            <span className="text-white/70 text-sm hidden md:block">
              {session.user.email}
            </span>

            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-lg bg-cyan-500 text-black font-semibold hover:opacity-90"
            >
              Dashboard
            </Link>

            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="px-4 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            href="/login"
            className="px-4 py-2 rounded-lg bg-cyan-500 text-black font-semibold hover:opacity-90"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
