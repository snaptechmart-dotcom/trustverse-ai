"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import MobileHeader from "@/components/MobileHeader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* DESKTOP SIDEBAR (ONLY DESKTOP) */}
      <aside className="hidden md:block w-64 bg-gray-900 text-white">
        <Sidebar />
      </aside>

      {/* MOBILE SIDEBAR OVERLAY (ONLY MOBILE) */}
      {open && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="w-64 bg-gray-900 text-white">
            <Sidebar />
          </div>
          <div
            className="flex-1 bg-black/40"
            onClick={() => setOpen(false)}
          />
        </div>
      )}

      {/* RIGHT CONTENT */}
      <div className="flex-1 flex flex-col">

        {/* MOBILE HEADER (ONLY MOBILE) */}
        <div className="block md:hidden">
          <MobileHeader onMenuClick={() => setOpen(true)} />
        </div>

        <main className="flex-1 p-4">
          {children}
        </main>
      </div>
    </div>
  );
}
