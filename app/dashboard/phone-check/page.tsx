"use client";
import CreditWarningBanner from "@/components/CreditWarningBanner";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PhoneCheckPage() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const router = useRouter();

  const handleVerify = async () => {
    if (!phone) {
      alert("Please enter a phone number");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/phone-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      // 🚫 No credits
      if (res.status === 402) {
        alert("Your credits are finished. Please upgrade to Pro.");
        router.push("/pricing");
        return;
      }

      if (!res.ok) {
        alert("Something went wrong");
        return;
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Phone Verification
        </h1>
        <p className="text-gray-500 mt-1">
          Verify phone numbers to detect spam, fraud, or risk signals
        </p>
      </div>

      {/* INPUT */}
      <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4 max-w-xl">
        <input
          type="text"
          placeholder="Enter phone number with country code"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <button
          onClick={handleVerify}
          disabled={loading}
          className="bg-indigo-600 text-white px-5 py-2 rounded-md hover:bg-indigo-700 transition disabled:opacity-60"
        >
          {loading ? "Verifying..." : "Verify Phone"}
        </button>
      </div>

      {/* RESULT */}
      {result && (
        <div className="bg-white border rounded-xl p-6 max-w-xl space-y-2">
          <p><strong>Status:</strong> {result.status}</p>
          <p><strong>Risk:</strong> {result.risk}</p>
          <p><strong>Country:</strong> {result.country}</p>
          <p><strong>Carrier:</strong> {result.carrier}</p>

          {result.remainingCredits !== "unlimited" && (
            <p className="text-sm text-gray-500">
              Remaining Credits: {result.remainingCredits}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
