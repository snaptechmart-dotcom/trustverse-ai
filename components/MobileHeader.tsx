"use client";

import { Menu } from "lucide-react";

export default function MobileHeader() {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white shadow">
      <span className="font-bold text-black">Trustverse AI</span>
      <Menu size={28} color="#000" />
    </div>
  );
}
