"use client";

import { useState } from "react";

interface PhoneCheckResult {
  status: string;
  risk: string;
}

export default function PhoneCheckerPage() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PhoneCheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [creditsLeft, setCreditsLeft] = useState<number | null>(null);

  const checkPhone = async () => {
    if (!phone.trim()) {
      setError("Please enter a phone number");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/tools/run-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tool: "phone-check",
          input: phone,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to analyze phone number");
        return;
      }

      setResult(data.result);
      setCreditsLeft(data.creditsLeft);
      setPhone("");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const riskColor =
    result?.risk === "Safe"
      ? "bg-green-50 border-green-300 text-green-700"
      : result?.risk === "Suspicious"
      ? "bg-yellow-50 border-yellow-300 text-yellow-700"
      : "bg-red-50 border-red-300 text-red-700";

  return (
    <div className="min-h-screen px-4 py-8 md:px-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-2">
        Phone Number Checker
      </h1>

      <p className="text-gray-600 mb-6">
        Analyze phone number validity, activity status, and spam probability.
      </p>

      {/* INPUT */}
      <div className="max-w-xl bg-white border rounded-lg p-4 space-y-4">
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter phone number (e.g. +91XXXXXXXXXX)"
          className="w-full border rounded p-3 text-sm"
        />

        <button
          onClick={checkPhone}
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded font-semibold disabled:opacity-50"
        >
          {loading ? "Checking..." : "Check Phone"}
        </button>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-3">
            {error}
          </div>
        )}
      </div>

      {/* RESULT */}
      {result && (
        <div
          className={`mt-6 max-w-xl border rounded-lg p-4 space-y-2 ${riskColor}`}
        >
          <p className="font-semibold text-lg">Result</p>

          <p className="text-sm">
            <strong>Status:</strong> {result.status}
          </p>

          <p className="text-sm">
            <strong>Risk Level:</strong>{" "}
            <span className="font-semibold">{result.risk}</span>
          </p>

          {creditsLeft !== null && (
            <p className="text-xs">
              Credits left:{" "}
              <span className="font-semibold">{creditsLeft}</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
