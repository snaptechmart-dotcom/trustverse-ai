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
    <div className="w-64 bg-gray-900 text-white p-5">
      <div className="mb-6 text-xl font-bold">
        Trustverse AI
      </div>

      <nav className="space-y-2">
        {menuItems.map(({ name, href, icon: Icon }) => {
          const active = pathname === href;

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
    </div>
  );
}
