"use client";

import { Menu } from "lucide-react";

export default function MobileHeader({
  onMenuClick,
}: {
  onMenuClick: () => void;
}) {
  return (
    <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white shadow">
      <h1 className="font-bold text-lg">Trustverse AI</h1>
      <button onClick={onMenuClick}>
        <Menu size={26} />
      </button>
    </div>
  );
}
