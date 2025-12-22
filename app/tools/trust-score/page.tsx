"use client";

import { useState } from "react";

interface TrustScoreResult {
  trustScore: number;
  level: string;
}

export default function TrustScorePage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TrustScoreResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [creditsLeft, setCreditsLeft] = useState<number | null>(null);

  const runTrustScore = async () => {
    if (!input.trim()) {
      setError("Please enter username, phone or email");
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
          tool: "trust-score",
          input,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to calculate trust score");
        return;
      }

      setResult(data.result);
      setCreditsLeft(data.creditsLeft);
      setInput("");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-8 md:px-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-2">
        Trust Score Analyzer
      </h1>

      <p className="text-gray-600 mb-6">
        Analyze digital trust level using AI-based signals and reputation data.
      </p>

      {/* INPUT CARD */}
      <div className="max-w-xl bg-white border rounded-lg p-4 space-y-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter username, phone number or email"
          className="w-full border rounded p-3 text-sm"
        />

        <button
          onClick={runTrustScore}
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded font-semibold disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Check Trust Score"}
        </button>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-3">
            {error}
          </div>
        )}
      </div>

      {/* RESULT (COLOR POLISHED) */}
      {result && (
        <div
          className={`mt-6 max-w-xl border rounded-lg p-4 space-y-2
            ${
              result.trustScore >= 80
                ? "bg-green-50 border-green-300"
                : result.trustScore >= 50
                ? "bg-yellow-50 border-yellow-300"
                : "bg-red-50 border-red-300"
            }
          `}
        >
          <p className="font-semibold text-lg">Result</p>

          <p className="text-sm">
            <strong>Trust Score:</strong>{" "}
            <span className="font-bold">
              {result.trustScore}/100
            </span>
          </p>

          <p className="text-sm">
            <strong>Risk Level:</strong>{" "}
            <span
              className={`font-semibold ${
                result.trustScore >= 80
                  ? "text-green-700"
                  : result.trustScore >= 50
                  ? "text-yellow-700"
                  : "text-red-700"
              }`}
            >
              {result.level}
            </span>
          </p>

          {creditsLeft !== null && (
            <p className="text-xs text-gray-600">
              Credits left:{" "}
              <span className="font-semibold">{creditsLeft}</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
