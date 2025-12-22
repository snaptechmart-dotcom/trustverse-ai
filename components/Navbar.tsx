"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import {
  HiOutlineHome,
  HiOutlineCog,
  HiOutlineUser,
  HiOutlineLogout,
} from "react-icons/hi";

export default function Navbar() {
  return (
    <header className="h-16 bg-[#061826] flex items-center justify-between px-6 border-b border-white/10">
      {/* LEFT SIDE */}
      <div className="flex items-center gap-6 text-white">
        <span className="font-semibold text-lg">
          Trustverse AI
        </span>

        <Link
          href="/dashboard"
          className="flex items-center gap-1 text-sm text-gray-300 hover:text-white"
        >
          <HiOutlineHome />
          Dashboard
        </Link>

        <Link
          href="/tools"
          className="flex items-center gap-1 text-sm text-gray-300 hover:text-white"
        >
          <HiOutlineCog />
          Tools
        </Link>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-4 text-white">
        <Link
          href="/dashboard/settings"
          className="flex items-center gap-1 text-sm text-gray-300 hover:text-white"
        >
          <HiOutlineUser />
          Profile
        </Link>

        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-1 bg-white/10 px-3 py-2 rounded-md text-sm hover:bg-white/20"
        >
          <HiOutlineLogout />
          Logout
        </button>
      </div>
    </header>
  );
}
