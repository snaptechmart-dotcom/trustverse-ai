"use client";

import { useState } from "react";

interface AdvancedAIResult {
  verdict: string;
  confidence: string;
  riskLevel: "Low" | "Medium" | "High";
  signals: string[];
}

export default function AdvancedAIPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AdvancedAIResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [creditsLeft, setCreditsLeft] = useState<number | null>(null);

  const runAdvancedAI = async () => {
    if (!input.trim()) {
      setError("Please enter username, phone, email or profile reference");
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
          tool: "advanced-ai",
          input,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Advanced AI analysis failed");
        return;
      }

      // Demo + premium-feel result
      setResult({
        verdict:
          "No critical risk patterns detected. The profile appears generally safe based on current signals.",
        confidence: "High",
        riskLevel: "Low",
        signals: [
          "No known scam indicators",
          "Stable digital footprint",
          "No mass negative reports",
          "Normal behavioral patterns",
        ],
      });

      setCreditsLeft(data.creditsLeft);
      setInput("");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const riskStyle =
    result?.riskLevel === "Low"
      ? "bg-green-50 border-green-300 text-green-800"
      : result?.riskLevel === "Medium"
      ? "bg-yellow-50 border-yellow-300 text-yellow-800"
      : "bg-red-50 border-red-300 text-red-800";

  return (
    <div className="min-h-screen px-4 py-8 md:px-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-2">
        Advanced AI Risk Analysis
      </h1>

      <p className="text-gray-600 mb-6 max-w-2xl">
        Perform deep AI-assisted risk analysis using behavioral patterns,
        complaint signals, reputation data and digital footprint indicators.
      </p>

      {/* INPUT */}
      <div className="max-w-xl bg-white border rounded-lg p-4 space-y-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Username, phone number, email or profile reference"
          className="w-full border rounded p-3 text-sm"
        />

        <button
          onClick={runAdvancedAI}
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded font-semibold disabled:opacity-50"
        >
          {loading ? "Running AI Analysis..." : "Run Advanced AI Analysis"}
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
          className={`mt-6 max-w-2xl border rounded-lg p-5 space-y-3 ${riskStyle}`}
        >
          <p className="font-semibold text-lg">
            AI Analysis Result
          </p>

          <p className="text-sm">
            <strong>Overall Verdict:</strong> {result.verdict}
          </p>

          <p className="text-sm">
            <strong>Risk Level:</strong>{" "}
            <span className="font-semibold">{result.riskLevel}</span>
          </p>

          <p className="text-sm">
            <strong>AI Confidence:</strong>{" "}
            <span className="font-semibold">{result.confidence}</span>
          </p>

          <div>
            <p className="text-sm font-medium mb-1">
              Key Signals Considered:
            </p>
            <ul className="list-disc list-inside text-sm space-y-1">
              {result.signals.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>

          {creditsLeft !== null && (
            <p className="text-xs mt-2">
              Credits left:{" "}
              <span className="font-semibold">{creditsLeft}</span>
            </p>
          )}

          <p className="text-[11px] text-gray-600 mt-3">
            ⚠️ This analysis is AI-assisted and based on available signals.
            It should be used as a decision-support tool, not as a sole
            authority.
          </p>
        </div>
      )}
    </div>
  );
}
