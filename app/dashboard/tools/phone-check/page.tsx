"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import CreditWarningBanner from "@/components/CreditWarningBanner";

export default function PhoneCheckPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleCheck = async () => {
    if (!phone) {
      alert("Please enter a phone number");
      return;
    }

    if (!session?.user?.id) {
      alert("Session expired. Please login again.");
      router.push("/login");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/phone-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          userId: session.user.id,
        }),
      });

      if (res.status === 401) {
        alert("Session expired. Please login again.");
        router.push("/login");
        return;
      }

      if (res.status === 402) {
        alert("No credits left. Please upgrade to Pro.");
        router.push("/pricing");
        return;
      }

      if (!res.ok) {
        alert("Service temporarily unavailable. Please try again.");
        return;
      }

      const data = await res.json();
      setResult(data);

      // ✅ clear input after success
      setPhone("");
    } catch (err) {
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return <div className="p-6 text-gray-500">Loading...</div>;
  }

  return (
    <div className="space-y-10 max-w-4xl">
      {/* CREDIT WARNING */}
      <CreditWarningBanner />

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Phone Number Checker
        </h1>
        <p className="text-gray-500 mt-2 max-w-3xl">
          Verify phone numbers to identify spam, fraud, or risky activity using
          automated risk signals before making calls or sharing information.
        </p>
      </div>

      {/* INPUT CARD */}
      <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4 max-w-xl">
        <input
          type="text"
          placeholder="Enter phone number with country code"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full bg-slate-50 border border-slate-300 rounded-md px-4 py-2
          focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />

        <button
          onClick={handleCheck}
          disabled={loading}
          className="bg-emerald-600 text-white px-5 py-2 rounded-md hover:bg-emerald-700 transition disabled:opacity-60"
        >
          {loading ? "Checking..." : "Check Number"}
        </button>
      </div>

      {/* DESCRIPTION */}
      <div className="space-y-6 text-gray-700 max-w-3xl">
        <h2 className="text-xl font-semibold text-gray-900">
          How Phone Number Checker Works
        </h2>

        <p>
          Phone Number Checker helps users assess whether a phone number appears
          safe or potentially risky. The system evaluates automated risk signals
          such as usage patterns and known indicators associated with spam or
          fraudulent activity.
        </p>

        <ul className="list-disc pl-6 space-y-2">
          <li>Identify potential spam or scam phone numbers</li>
          <li>Detect risky or suspicious number behavior</li>
          <li>Reduce exposure to fraud or unwanted calls</li>
        </ul>

        <p className="text-sm text-gray-500">
          Disclaimer: Results are generated using automated indicators and are
          intended for guidance only. Always exercise personal judgment.
        </p>
      </div>

      {/* RESULT */}
      {result && (
        <div className="bg-white border rounded-xl p-6 max-w-xl space-y-2">
          <p>
            <strong>Status:</strong> {result.status}
          </p>
          <p>
            <strong>Risk Level:</strong> {result.risk}
          </p>

          {result.remainingCredits !== undefined && (
            <p className="text-sm text-gray-500">
              Remaining Credits: {result.remainingCredits}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
