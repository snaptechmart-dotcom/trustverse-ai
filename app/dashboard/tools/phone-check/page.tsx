"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import CreditWarningBanner from "@/components/CreditWarningBanner";

export default function PhoneCheckPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleCheck = async () => {
    if (!phone) {
      alert("Please enter a phone number");
      return;
    }

    const userId = session?.user?.id;
    if (!userId) {
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
          userId,
        }),
      });

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
      setPhone(""); // ✅ clear input
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 max-w-4xl">
      <CreditWarningBanner />

      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Phone Number Checker
        </h1>
        <p className="text-gray-500 mt-2 max-w-3xl">
          Verify phone numbers to detect spam, fraud, or risky activity before
          making calls, payments, or sharing sensitive information.
        </p>
      </div>

      <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4 max-w-xl">
        <input
          type="text"
          placeholder="Enter phone number with country code"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full bg-slate-50 border border-slate-300 rounded-md px-4 py-2
          focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />

        <button
          onClick={handleCheck}
          disabled={loading}
          className="bg-emerald-600 text-white px-5 py-2 rounded-md hover:bg-emerald-700 transition disabled:opacity-60"
        >
          {loading ? "Checking..." : "Check Number"}
        </button>
      </div>

      {result && (
        <div className="bg-white border rounded-xl p-6 max-w-xl space-y-2">
          <p>
            <strong>Status:</strong> {result.status}
          </p>
          <p>
            <strong>Risk Level:</strong> {result.risk}
          </p>
          <p className="text-sm text-gray-500">
            Remaining Credits: {result.remainingCredits}
          </p>
        </div>
      )}
    </div>
  );
}
