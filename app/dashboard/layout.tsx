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
    <div className="min-h-screen bg-gray-100">
      
      {/* Mobile Header */}
      <MobileHeader onMenuClick={() => setOpen(true)} />

      <div className="flex">

        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 bg-gray-900 text-white">
          <Sidebar />
        </aside>

        {/* Mobile Sidebar */}
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

        {/* Main Content */}
        <main className="flex-1 p-4">
          {children}
        </main>

      </div>
    </div>
  );
}
