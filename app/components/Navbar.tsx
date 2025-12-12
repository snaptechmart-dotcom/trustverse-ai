"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { HiMenu, HiX } from "react-icons/hi";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full bg-[#081b33] text-white px-6 py-4 flex items-center justify-between shadow-md">

      {/* LEFT — LOGO + NAME */}
      <Link href="/" className="flex items-center gap-3">
        <Image
          src="/trustverse-logo.png"
          width={60}
          height={60}
          alt="Trustverse AI"
          className="rounded-md"
        />
        <span className="text-2xl font-bold tracking-wide">Trustverse AI</span>
      </Link>

      {/* MOBILE MENU ICON */}
      <button
        className="md:hidden text-3xl"
        onClick={() => setOpen(!open)}
      >
        {open ? <HiX /> : <HiMenu />}
      </button>

      {/* DESKTOP MENU */}
      <div className="hidden md:flex items-center gap-8 text-lg">
        <Link href="/" className="hover:text-gray-300 transition">Home</Link>
        <Link href="/pricing" className="hover:text-gray-300 transition">Pricing</Link>
        <Link href="/tools" className="hover:text-gray-300 transition">AI Tools</Link>
        <Link href="/contact" className="hover:text-gray-300 transition">Contact</Link>
      </div>

      {/* DESKTOP BUTTONS */}
      <div className="hidden md:flex items-center gap-4">
        <Link
          href="/waitlist"
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-4 py-2 rounded-lg transition"
        > Pre-Launch </Link>

        <Link
          href="/login"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition"
        > Login </Link>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {open && (
        <div className="absolute top-20 left-0 w-full bg-[#081b33] py-6 flex flex-col items-center gap-6 md:hidden shadow-lg z-50">

          <Link href="/" onClick={() => setOpen(false)} className="text-lg">Home</Link>
          <Link href="/pricing" onClick={() => setOpen(false)} className="text-lg">Pricing</Link>
          <Link href="/tools" onClick={() => setOpen(false)} className="text-lg">AI Tools</Link>
          <Link href="/contact" onClick={() => setOpen(false)} className="text-lg">Contact</Link>

          <Link
            href="/waitlist"
            onClick={() => setOpen(false)}
            className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-semibold"
          >
            Pre-Launch
          </Link>

          <Link
            href="/login"
            onClick={() => setOpen(false)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold"
          >
            Login
          </Link>

        </div>
      )}

    </nav>
  );
}
