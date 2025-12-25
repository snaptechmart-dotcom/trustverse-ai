"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TrustScorePage() {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const router = useRouter();

  const handleAnalyze = async () => {
    if (!value) {
      alert("Please enter phone, email or username");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/trust-score", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: value }),
      });

      // 🚫 NO CREDITS → UPGRADE
      if (res.status === 402) {
        alert("Your credits are finished. Please upgrade to Pro.");
        router.push("/pricing");
        return;
      }

      // ❌ Other error
      if (!res.ok) {
        alert("Something went wrong. Try again.");
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
          Trust Score Analyzer
        </h1>
        <p className="text-gray-500 mt-1">
          Analyze people, numbers or profiles using AI-powered trust signals
        </p>
      </div>

      {/* INPUT CARD */}
      <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4 max-w-xl">
        <input
          type="text"
          placeholder="Enter phone number, username, or email"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="bg-indigo-600 text-white px-5 py-2 rounded-md hover:bg-indigo-700 transition disabled:opacity-60"
        >
          {loading ? "Analyzing..." : "Analyze Trust"}
        </button>
      </div>

      {/* RESULT */}
      {result && (
        <div className="bg-white border rounded-xl p-6 max-w-xl space-y-2">
          <p>
            <strong>Trust Score:</strong> {result.trustScore}
          </p>
          <p>
            <strong>Risk Level:</strong> {result.risk}
          </p>
          <p>
            <strong>Confidence:</strong> {result.confidence}
          </p>

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
