"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CreditWarningBanner from "@/components/CreditWarningBanner";

export default function TrustScorePage() {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const router = useRouter();

  const handleAnalyze = async () => {
    if (!value) return alert("Please enter input");

    setLoading(true);
    setResult(null);

    const res = await fetch("/api/trust-score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: value }),
    });

    if (res.status === 402) {
      alert("Credits finished. Upgrade to Pro.");
      router.push("/pricing");
      return;
    }

    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      <CreditWarningBanner />

      <div>
        <h1 className="text-3xl font-bold">Trust Score Analyzer</h1>
        <p className="text-gray-500 mt-1">
          Analyze people, phone numbers, or profiles using AI-powered trust signals.
        </p>
      </div>

      <div className="bg-white border rounded-xl p-6 max-w-xl space-y-4">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter phone number, username, or email"
          className="w-full bg-slate-50 border border-slate-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-indigo-500"
        />

        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="bg-indigo-600 text-white px-5 py-2 rounded-md hover:bg-indigo-700"
        >
          {loading ? "Analyzing..." : "Analyze Trust"}
        </button>
      </div>

      <div className="max-w-3xl text-gray-700 space-y-3">
        <h2 className="text-lg font-semibold">What this tool does</h2>
        <p>
          Trust Score Analyzer evaluates risk based on past reports, behavioral
          patterns, and verification signals to help you avoid fraud, spam, or
          suspicious identities.
        </p>
        <ul className="list-disc pl-5">
          <li>Detect fake or high-risk profiles</li>
          <li>Check trustworthiness before interaction</li>
          <li>AI-driven score with clear risk level</li>
        </ul>
      </div>

      {result && (
        <div className="bg-white border rounded-xl p-6 max-w-xl">
          <p><b>Trust Score:</b> {result.trustScore}</p>
          <p><b>Risk:</b> {result.risk}</p>
          <p><b>Confidence:</b> {result.confidence}</p>
        </div>
      )}
    </div>
  );
}
