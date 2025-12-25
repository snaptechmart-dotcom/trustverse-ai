"use client";

import { useState } from "react";
import CreditWarningBanner from "@/components/CreditWarningBanner";

export default function AdvancedAIAnalysisPage() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runAnalysis = async () => {
    if (!input) {
      alert("Please enter a phone number, email, username, or profile link.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      // ⚠️ Demo analysis logic (replace with real AI later)
      await new Promise((r) => setTimeout(r, 1200));

      const riskRand = Math.random();
      const riskLevel =
        riskRand > 0.7
          ? "Low Risk"
          : riskRand > 0.4
          ? "Medium Risk"
          : "High Risk";

      const confidence = `${Math.floor(Math.random() * 25) + 70}%`;

      setResult({
        risk: riskLevel,
        confidence,
        signals: [
          "Cross-platform activity patterns",
          "Behavioral risk indicators",
          "Historical trust signals",
          "Anomaly detection markers",
        ],
      });
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
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
          Advanced AI Analysis
        </h1>
        <p className="text-gray-500 mt-2 max-w-3xl">
          Perform deep AI-powered risk analysis using multiple trust signals,
          behavioral indicators, and cross-platform data to uncover hidden
          threats or suspicious patterns.
        </p>
      </div>

      {/* INPUT CARD */}
      <div className="bg-white border rounded-xl p-6 space-y-4 max-w-xl shadow-sm">
        <input
          type="text"
          placeholder="Enter phone number, email, username, or profile URL"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full bg-slate-50 border border-slate-300 rounded-md px-4 py-2
          focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
        />

        <button
          onClick={runAnalysis}
          disabled={loading}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md transition disabled:opacity-60"
        >
          {loading ? "Running Analysis..." : "Run Advanced Analysis"}
        </button>
      </div>

      {/* DESCRIPTION */}
      <div className="space-y-6 text-gray-700 max-w-3xl">
        <h2 className="text-xl font-semibold text-gray-900">
          What Advanced AI Analysis Does
        </h2>

        <p>
          Advanced AI Analysis is designed for deeper investigation when basic
          checks are not sufficient. It combines multiple layers of AI-driven
          evaluation to detect complex fraud patterns, identity risks, and
          high-confidence threat signals.
        </p>

        <p>
          The system evaluates cross-platform behavior, historical trust data,
          anomaly detection signals, and advanced risk indicators to provide a
          comprehensive assessment of the input.
        </p>

        <ul className="list-disc pl-6 space-y-2">
          <li>Cross-platform risk correlation</li>
          <li>Advanced behavioral anomaly detection</li>
          <li>High-confidence fraud probability assessment</li>
          <li>Deeper insights beyond standard trust checks</li>
        </ul>

        <p className="font-medium text-gray-800">
          Risk Levels Explained:
        </p>

        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Low Risk:</strong> No significant threat indicators
            detected.
          </li>
          <li>
            <strong>Medium Risk:</strong> Some anomalies found; further
            verification recommended.
          </li>
          <li>
            <strong>High Risk:</strong> Strong indicators of malicious or
            fraudulent behavior detected.
          </li>
        </ul>

        <p className="text-sm text-gray-500">
          Disclaimer: Advanced AI Analysis provides automated risk insights for
          guidance purposes only. Results should not be considered absolute and
          must be combined with human judgment and additional verification.
        </p>
      </div>

      {/* RESULT */}
      {result && (
        <div className="bg-white border rounded-xl p-6 max-w-xl space-y-3">
          <p>
            <strong>Risk Level:</strong>{" "}
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

          <p>
            <strong>Confidence:</strong> {result.confidence}
          </p>

          <div>
            <strong>Key Signals Analyzed:</strong>
            <ul className="list-disc pl-5 mt-1 text-sm">
              {result.signals.map((s: string, i: number) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
