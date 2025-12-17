"use client";

import Sidebar from "@/components/Sidebar";
import MobileHeader from "@/components/MobileHeader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* Sidebar – desktop only */}
      <aside className="hidden md:block">
        <Sidebar />
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">

        {/* Mobile header */}
        <div className="md:hidden">
          <MobileHeader onMenuClick={() => {}} />
        </div>

        <main className="flex-1 p-4">
          {children}
        </main>
      </div>
    </div>
  );
}
