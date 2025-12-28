"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CreditWarningBanner from "@/components/CreditWarningBanner";

type ResultType = {
  status: string;
  risk: "Low Risk" | "Medium Risk" | "High Risk";
  remainingCredits: number | "unlimited";
};

export default function PhoneCheckerPage() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResultType | null>(null);

  const router = useRouter();

  const handleCheck = async () => {
    if (!phone.trim()) {
      alert("Please enter a phone number with country code.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/phone-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.trim() }),
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

      const data: ResultType = await res.json();
      setResult(data);

      setPhone("");
      window.dispatchEvent(new Event("credits-updated"));
    } catch (err) {
      alert("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 max-w-4xl">
      {/* CREDIT WARNING */}
      <CreditWarningBanner />

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Phone Number Checker
        </h1>
        <p className="text-gray-500 mt-2 max-w-3xl">
          Verify phone numbers to detect spam, fraud, or risky activity using
          automated AI risk signals before taking action.
        </p>
      </div>

      {/* INPUT */}
      <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4 max-w-xl">
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter phone number with country code (e.g. +91...)"
          className="w-full bg-slate-50 border border-slate-300 rounded-md px-4 py-2
          focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />

        <button
          onClick={handleCheck}
          disabled={loading}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-md
          transition disabled:opacity-60"
        >
          {loading ? "Checking..." : "Check Number"}
        </button>
      </div>

      {/* RESULT — TRUSTVERSE AI REPORT */}
      {result && (
        <div className="bg-white border rounded-xl p-6 max-w-2xl space-y-5">
          <h3 className="text-xl font-semibold text-gray-900">
            🔍 Trustverse AI Verification Report
          </h3>

          <p>
            <strong>Verification Status:</strong>{" "}
            <span className="text-emerald-600 font-semibold">
              Successfully Completed ✅
            </span>
          </p>

          <div className="space-y-2 text-gray-700">
            <p>
              <strong>Risk Assessment Summary:</strong>
            </p>
            <p className="text-sm leading-relaxed">
              Our AI-powered system analyzed multiple automated risk signals
              including spam indicators, usage patterns, and reported behavior.
              Based on this analysis, the phone number shows a{" "}
              <strong>{result.risk}</strong> profile.
            </p>
          </div>

          <div>
            <p className="font-medium text-gray-800">What This Means:</p>
            <ul className="list-disc pl-6 text-sm text-gray-700 space-y-1 mt-2">
              <li>No major suspicious or fraudulent activity detected</li>
              <li>The number appears safe for general communication</li>
              <li>Suitable for business and personal use</li>
            </ul>
          </div>

          <p>
            <strong>Final Risk Level:</strong>{" "}
            <span
              className={
                result.risk === "Low Risk"
                  ? "text-green-600 font-bold"
                  : result.risk === "Medium Risk"
                  ? "text-yellow-600 font-bold"
                  : "text-red-600 font-bold"
              }
            >
              {result.risk}
            </span>
          </p>

          <div className="border-t pt-4 text-sm text-gray-600 space-y-1">
            <p>
              <strong>Credits Used:</strong> 1
            </p>
            <p>
              <strong>Available Credits:</strong>{" "}
              {result.remainingCredits === "unlimited"
                ? "Unlimited"
                : result.remainingCredits}
            </p>
          </div>

          <p className="text-xs text-gray-500 italic">
            This result is generated using automated indicators and should be
            used as guidance only. Upgrade to Pro for unlimited checks and deeper
            insights.
          </p>
        </div>
      )}

      {/* DESCRIPTION — ALWAYS SHOWN (RESULT KE BAAD BHI) */}
      <div className="space-y-6 text-gray-700 max-w-3xl">
        <h2 className="text-xl font-semibold text-gray-900">
          How Phone Number Checker Works
        </h2>

        <p>
          Phone Number Checker helps users assess whether a phone number appears
          safe or potentially risky. The system evaluates automated risk signals
          such as usage patterns, known spam indicators, and reported behavior.
        </p>

        <ul className="list-disc pl-6 space-y-2">
          <li>Identify potential spam or scam phone numbers</li>
          <li>Detect risky or suspicious number behavior</li>
          <li>Reduce exposure to fraud or unwanted calls</li>
        </ul>

        <p className="text-sm text-gray-500">
          Disclaimer: Results are generated using automated indicators and are
          intended for guidance only. Always apply personal judgment before
          taking action.
        </p>
      </div>
    </div>
  );
}
