"use client";

import { Menu } from "lucide-react";

export default function MobileHeader({
  onMenuClick,
}: {
  onMenuClick: () => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 16px",
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e5e7eb",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <span style={{ fontWeight: "bold", color: "#000" }}>
        Trustverse AI
      </span>

      <button onClick={onMenuClick}>
        <Menu size={28} color="#000" />
      </button>
    </div>
  );
}
