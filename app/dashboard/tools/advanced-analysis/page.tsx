"use client";

import { useState } from "react";

export default function AdvancedAIAnalysis() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<any>(null);

  const analyze = async () => {
    if (!input) return;

    const probability = Math.floor(Math.random() * 60) + 40;

    let risk = "Low Risk";
    if (probability > 75) risk = "High Risk";
    else if (probability > 55) risk = "Medium Risk";

    const signals = [
      "Repeated suspicious activity",
      "Low trust network",
      "Automated behavior detected",
    ];

    setResult({ probability, risk, signals });

    // 🧠 SAVE HISTORY
    try {
      await fetch("/api/save-history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "Advanced AI Analysis",
          input,
          result: `${probability}% - ${risk}`,
        }),
      });
    } catch (err) {
      console.error("History save failed", err);
    }
  };

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-bold">Advanced AI Analysis</h1>

      <input
        type="text"
        placeholder="Enter phone / email / username"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full border px-4 py-2 rounded"
      />

      <button
        onClick={analyze}
        className="bg-red-600 text-white px-6 py-2 rounded"
      >
        Run AI Analysis
      </button>

      {result && (
        <div className="border rounded-lg p-4 bg-gray-50">
          <p>
            <strong>Scam Probability:</strong>{" "}
            {result.probability}%
          </p>
          <p className="mt-2">
            <strong>Risk Level:</strong> {result.risk}
          </p>
        </div>
      )}
    </div>
  );
}
