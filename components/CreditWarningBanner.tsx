"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function CreditWarningBanner() {
  const { status } = useSession();
  const [credits, setCredits] = useState<number | null>(null);

  useEffect(() => {
    // 🔒 DO NOTHING if not logged in
    if (status !== "authenticated") {
      setCredits(null);
      return;
    }

    const fetchCredits = async () => {
      try {
        const res = await fetch("/api/credits");
        if (!res.ok) return;
        const data = await res.json();
        setCredits(data.credits);
      } catch {
        setCredits(null);
      }
    };

    fetchCredits();
  }, [status]);

  // ❌ No session OR no data → no banner
  if (status !== "authenticated" || credits === null) return null;

  if (credits > 2) return null;

  return (
    <div className="mb-4 rounded-md border border-yellow-300 bg-yellow-50 px-4 py-3 text-sm text-yellow-800 flex items-center justify-between">
      <span>
        Only <strong>{credits}</strong> credits left. Consider upgrading to Pro.
      </span>
      <Link
        href="/pricing"
        className="ml-4 rounded-md bg-yellow-500 px-3 py-1.5 text-white hover:bg-yellow-600"
      >
        Upgrade
      </Link>
    </div>
  );
}
