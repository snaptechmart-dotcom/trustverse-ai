"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function CreditWarningBanner() {
  const [credits, setCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCredits() {
      try {
        const res = await fetch("/api/credits");
        const data = await res.json();
        setCredits(data.credits);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchCredits();
  }, []);

  if (loading || credits === null) return null;

  // 🟢 Enough credits
  if (credits > 2) return null;

  // 🔴 No credits
  if (credits === 0) {
    return (
      <div className="mb-4 rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-center justify-between">
        <span>
          You have no credits left. Upgrade to Pro to continue using AI tools.
        </span>
        <Link
          href="/pricing"
          className="ml-4 rounded-md bg-red-600 px-3 py-1.5 text-white hover:bg-red-700"
        >
          Upgrade
        </Link>
      </div>
    );
  }

  // 🟡 Low credits warning
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
