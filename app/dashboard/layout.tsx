import React from "react";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar (mobile + desktop dono ke liye) */}
      <Sidebar />

      {/* Main content */}
      <main className="pt-16 lg:pt-6 lg:ml-64 p-4">
        {children}
      </main>
    </div>
  );
}
