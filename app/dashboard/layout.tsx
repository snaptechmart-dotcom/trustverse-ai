import React from "react";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen bg-gray-100">
      {/* SIDEBAR – desktop only */}
      <div className="hidden lg:block fixed top-0 left-0 h-full w-64">
        <Sidebar />
      </div>

      {/* MAIN CONTENT */}
      <main className="h-full p-4 pt-16 lg:pt-4 lg:ml-64 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
