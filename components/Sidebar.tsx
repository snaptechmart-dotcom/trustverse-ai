"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  // ✅ NULL GUARD (THIS FIXES THE BUILD ERROR)
  if (!pathname) {
    return null;
  }

  // /profile/test or /profile/test/history
  const parts = pathname.split("/");
  const username = parts[2]; // profile/[username]

  return (
    <aside className="w-64 border-r p-4">
      <nav className="space-y-2">
        <Link
          href={`/profile/${username}`}
          className="block rounded px-3 py-2 hover:bg-gray-100"
        >
          Profile
        </Link>

        <Link
          href={`/profile/${username}/history`}
          className="block rounded px-3 py-2 hover:bg-gray-100"
        >
          History
        </Link>
      </nav>
    </aside>
  );
}
