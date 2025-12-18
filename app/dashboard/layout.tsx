"use client";

import Sidebar from "@/components/Sidebar";
import MobileHeader from "@/components/MobileHeader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-gray-100 text-black">

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex md:flex-col w-64 bg-gray-900 text-white">
        <Sidebar />
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-h-screen">

        {/* MOBILE HEADER */}
        <div className="md:hidden">
          <MobileHeader />
        </div>

        <main className="flex-1 p-4">
          {children}
        </main>
      </div>
    </div>
  );
}
