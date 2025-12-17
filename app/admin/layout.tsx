"use client";

import AdminSidebar from "./AdminSidebar";
import { ReactNode } from "react";

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* LEFT SIDEBAR */}
      <AdminSidebar />

      {/* RIGHT CONTENT */}
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}
