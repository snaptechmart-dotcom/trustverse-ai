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
    if (!value) {
      alert("Please enter a phone number, email address, or username.");
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

      // 🚫 No credits left → upgrade
      if (res.status === 402) {
        alert("You have no credits left. Please upgrade to Pro to continue.");
        router.push("/pricing");
        return;
      }

      if (!res.ok) {
        alert("Something went wrong. Please try again.");
        return;
      }

      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error(error);
      alert("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 max-w-4xl">
      {/* CREDIT WARNING */}
      <CreditWarningBanner />

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Trust Score Analyzer
        </h1>
        <p className="text-gray-500 mt-2 max-w-3xl">
          Analyze the trustworthiness of phone numbers, email addresses,
          usernames, or online profiles using AI-powered risk signals before
          making important decisions.
        </p>
      </div>

      {/* INPUT CARD */}
      <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4 max-w-xl">
        <input
          type="text"
          placeholder="Enter phone number, email, or username"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full bg-slate-50 border border-slate-300 rounded-md px-4 py-2
          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />

        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="bg-indigo-600 text-white px-5 py-2 rounded-md hover:bg-indigo-700 transition disabled:opacity-60"
        >
          {loading ? "Analyzing..." : "Analyze Trust"}
        </button>
      </div>

      {/* DESCRIPTION */}
      <div className="space-y-6 text-gray-700 max-w-3xl">
        <h2 className="text-xl font-semibold text-gray-900">
          How Trust Score Analyzer Works
        </h2>

        <p>
          Trust Score Analyzer is designed to help users detect potential fraud,
          scams, and risky interactions before they happen. The system evaluates
          multiple automated trust signals and behavioral indicators to assess
          whether the provided input appears safe or suspicious.
        </p>

        <p>
          By combining historical risk patterns, activity signals, and AI-based
          evaluation models, the tool generates a <strong>Trust Score (0–100)</strong>{" "}
          along with a clear risk category to support confident and informed
          decision-making.
        </p>

        <ul className="list-disc pl-6 space-y-2">
          <li>Identify potentially fraudulent phone numbers or email addresses</li>
          <li>Detect suspicious usernames or online profiles</li>
          <li>Reduce risk before financial or personal interactions</li>
          <li>Make data-driven trust decisions with confidence</li>
        </ul>

        <p className="font-medium text-gray-800">
          Risk Levels Explained:
        </p>

        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Low Risk:</strong> No major suspicious indicators detected.
          </li>
          <li>
            <strong>Medium Risk:</strong> Some warning signals present; proceed
            with caution.
          </li>
          <li>
            <strong>High Risk:</strong> Strong risk signals detected. Interaction
            is not recommended without further verification.
          </li>
        </ul>

        <p className="text-sm text-gray-500">
          Disclaimer: Trust Score Analyzer provides automated risk insights for
          guidance purposes only. Results should be used alongside personal
          judgment and additional verification when necessary.
        </p>
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
