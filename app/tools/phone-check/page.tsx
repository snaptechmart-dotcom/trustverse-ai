"use client";

import { useEffect, useState } from "react";

type ResultType = {
  status: string;
  riskLevel: string;
};

export default function PhoneCheckPage() {
  const [phone, setPhone] = useState("");
  const [credits, setCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResultType | null>(null);
  const [error, setError] = useState("");

  // 🔹 Load credits on page load
  useEffect(() => {
    fetchCredits();
  }, []);

  const fetchCredits = async () => {
    try {
      const res = await fetch("/api/check-credits");
      const data = await res.json();
      setCredits(data.credits ?? 0);
    } catch {
      setCredits(0);
    }
  };

  const handleCheck = async () => {
    setError("");
    setResult(null);

    if (!phone) {
      setError("Please enter a phone number");
      return;
    }

    setLoading(true);

    try {
      // 🔹 STEP 1: Fresh credit check
      const creditRes = await fetch("/api/check-credits");
      const creditData = await creditRes.json();

      if (creditData.credits <= 0) {
        setCredits(0);
        setError("No Credits Available. Please upgrade your plan.");
        setLoading(false);
        return;
      }

      // 🔹 STEP 2: Use one credit
      await fetch("/api/use-credit", { method: "POST" });

      // 🔹 STEP 3: Mock result (backend later)
      setResult({
        status: "Active",
        riskLevel: "Low",
      });

      // 🔹 STEP 4: Update credits UI
      setCredits(creditData.credits - 1);
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Phone Number Checker</h1>
      <p className="text-gray-600">
        Analyze phone number validity, activity status, and spam probability.
      </p>

      <input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Enter phone number (e.g. +919876543210)"
        className="w-full border rounded-lg px-4 py-3"
      />

      <button
        onClick={handleCheck}
        disabled={loading}
        className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800"
      >
        {loading ? "Checking..." : "Check Phone"}
      </button>

      {/* 🔹 Credits Info */}
      {credits !== null && (
        <p className="text-sm text-gray-500">
          Credits left: <b>{credits}</b>
        </p>
      )}

      {/* 🔴 Error */}
      {error && (
        <div className="bg-red-50 border border-red-300 text-red-700 p-4 rounded">
          {error}
          {error.includes("upgrade") && (
            <div className="mt-2">
              <a
                href="/pricing"
                className="inline-block bg-red-600 text-white px-4 py-2 rounded"
              >
                Upgrade Plan
              </a>
            </div>
          )}
        </div>
      )}

      {/* 🟢 Result */}
      {result && (
        <div className="bg-green-50 border border-green-300 p-4 rounded space-y-1">
          <p>
            <b>Status:</b> {result.status}
          </p>
          <p>
            <b>Risk Level:</b> {result.riskLevel}
          </p>
        </div>
      )}

      {/* 🔍 Explanation Section (NOW FIXED ✅) */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 text-sm text-gray-700 space-y-2">
        <p className="font-semibold text-gray-800">
          How Trustverse AI evaluates this number
        </p>

        <p>
          This phone number analysis is generated using multiple trust signals
          such as activity patterns, spam reports, and behavioral indicators.
        </p>

        <ul className="list-disc pl-5 space-y-1">
          <li>
            <b>Status:</b> Indicates whether the number appears active and reachable.
          </li>
          <li>
            <b>Risk Level:</b> Represents the likelihood of spam, fraud, or suspicious behavior.
          </li>
          <li>
            <b>Low Risk:</b> Generally safe with no strong spam signals detected.
          </li>
        </ul>

        <p className="text-xs text-gray-500">
          ⚠️ Disclaimer: This result is AI-generated and should be used as a trust
          signal, not a legal verification.
        </p>
      </div>
    </div>
  );
}
