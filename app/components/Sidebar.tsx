"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, User, History, LogOut, Phone, ShieldCheck } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "History", href: "/dashboard/history", icon: History },
    { name: "Phone Check", href: "/tools/phone-check", icon: Phone },
    { name: "Social Analyzer", href: "/tools/social-analyzer", icon: ShieldCheck },
    { name: "Trust Score", href: "/tools/trust-score", icon: User },
    { name: "Logout", href: "/logout", icon: LogOut },
  ];

  return (
    <div className="w-64 bg-white shadow-md h-screen p-6 flex flex-col">
      <h1 className="text-2xl font-bold text-blue-600 mb-10">Trustverse AI</h1>

      <nav className="flex-1">
        {menuItems.map(({ name, href, icon: Icon }) => {
          const active = pathname === href;

          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 p-3 mb-2 rounded-lg transition 
              ${active ? "bg-blue-600 text-white" : "hover:bg-gray-100 text-gray-700"}`}
            >
              <Icon size={20} />
              {name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
