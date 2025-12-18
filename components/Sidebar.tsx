"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconType } from "react-icons";
import {
  HiHome,
  HiSparkles,
  HiClock,
  HiCog,
} from "react-icons/hi";

interface MenuItem {
  name: string;
  href: string;
  icon: IconType;
}

const menuItems: MenuItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: HiHome },
  { name: "AI Tools", href: "/dashboard/tools", icon: HiSparkles },
  { name: "History", href: "/dashboard/history", icon: HiClock },
  { name: "Settings", href: "/dashboard/settings", icon: HiCog },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    /* 
      IMPORTANT:
      - h-full → layout se height lega
      - flex-col → content top to bottom
      - overflow-y-auto → agar future me items badhe
    */
    <div className="h-full w-64 bg-gray-900 text-white flex flex-col p-5 overflow-y-auto">

      {/* Logo / Title */}
      <div className="mb-6 text-xl font-bold">
        Trustverse AI
      </div>

      {/* Menu */}
      <nav className="space-y-2">
        {menuItems.map(({ name, href, icon: Icon }) => {
          const active =
            pathname === href ||
            pathname.startsWith(href + "/");

          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                active
                  ? "bg-blue-600"
                  : "hover:bg-gray-800"
              }`}
            >
              <Icon size={20} />
              <span>{name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Optional bottom spacer (future use) */}
      <div className="mt-auto pt-6 text-xs text-gray-400">
        © Trustverse AI
      </div>
    </div>
  );
}
