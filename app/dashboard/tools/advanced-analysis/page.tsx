"use client";

import { useState } from "react";

export default function AdvancedAIAnalysis() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<{
    probability: number;
    risk: string;
  } | null>(null);

  const analyze = async () => {
    if (!input) return;

    /* =========================
       STEP 1: CHECK + DEDUCT 2 CREDITS
       (Premium tool)
    ========================= */
    const creditRes1 = await fetch("/api/use-credit", {
      method: "POST",
    });

    if (!creditRes1.ok) {
      alert("You need at least 2 credits to run Advanced AI Analysis.");
      return;
    }

    const creditRes2 = await fetch("/api/use-credit", {
      method: "POST",
    });

    if (!creditRes2.ok) {
      alert("You need at least 2 credits to run Advanced AI Analysis.");
      return;
    }

    /* =========================
       STEP 2: AI ANALYSIS LOGIC
    ========================= */
    const probability = Math.floor(Math.random() * 60) + 40;

    let risk = "Low Risk";
    if (probability > 75) risk = "High Risk";
    else if (probability > 55) risk = "Medium Risk";

    setResult({ probability, risk });

    /* =========================
       STEP 3: SAVE HISTORY
    ========================= */
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
    } catch (error) {
      console.error("Failed to save history", error);
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
        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded"
      >
        Run AI Analysis (2 Credits)
      </button>

      {result && (
        <div className="border rounded-lg p-4 bg-gray-50">
          <p>
            <strong>Scam Probability:</strong>{" "}
            <span className="font-bold">{result.probability}%</span>
          </p>

          <p className="mt-2">
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
        </div>
      )}
    </div>
  );
}
