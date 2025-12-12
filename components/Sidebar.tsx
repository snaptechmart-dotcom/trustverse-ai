"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconType } from "react-icons";

interface MenuItem {
  name: string;
  href: string;
  icon: IconType;
}

const menuItems: MenuItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: require("react-icons/hi").HiHome },
  { name: "AI Tools", href: "/tools", icon: require("react-icons/hi").HiSparkles },
  { name: "History", href: "/dashboard/history", icon: require("react-icons/hi").HiClock },
  { name: "Settings", href: "/dashboard/settings", icon: require("react-icons/hi").HiCog },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-900 text-white h-screen p-5">
      <nav className="space-y-3">
        {menuItems.map(({ name, href, icon: Icon }) => {
          const active = pathname === href;

          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 p-3 rounded-lg transition ${
                active ? "bg-blue-600" : "hover:bg-gray-700"
              }`}
            >
              <Icon size={20} />
              <span>{name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
