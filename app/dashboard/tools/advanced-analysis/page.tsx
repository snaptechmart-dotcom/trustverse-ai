"use client";

import { useState } from "react";

export default function AdvancedAIAnalysis() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<null | {
    probability: number;
    risk: string;
    signals: string[];
  }>(null);

  const analyze = () => {
    // DEMO AI LOGIC
    const probability = Math.floor(Math.random() * 60) + 40;

    let risk = "Low Risk";
    if (probability > 75) risk = "High Risk";
    else if (probability > 55) risk = "Medium Risk";

    setResult({
      probability,
      risk,
      signals: [
        "Repeated suspicious activity",
        "Low trust network",
        "Automated behavior detected",
      ],
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">
        Advanced AI Analysis
      </h1>

      <p className="text-gray-500 mb-6">
        Deep AI-based risk, scam & behavior analysis
      </p>

      <input
        type="text"
        placeholder="Enter phone / email / username"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full max-w-md border rounded-lg px-4 py-2 mb-4"
      />

      <br />

      <button
        onClick={analyze}
        className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700"
      >
        Run AI Analysis
      </button>

      {result && (
        <div className="mt-6 max-w-md bg-white rounded-xl p-5 shadow">
          <p className="font-semibold mb-2">
            Scam Probability:
            <span className="ml-2 text-red-600">
              {result.probability}%
            </span>
          </p>

          <p className="mb-3">
            Risk Level:
            <span
              className={`ml-2 font-semibold ${
                result.risk === "High Risk"
                  ? "text-red-600"
                  : result.risk === "Medium Risk"
                  ? "text-yellow-600"
                  : "text-green-600"
              }`}
            >
              {result.risk}
            </span>
          </p>

          <div>
            <p className="font-semibold mb-2">
              Risk Signals:
            </p>
            <ul className="list-disc list-inside text-gray-600">
              {result.signals.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
