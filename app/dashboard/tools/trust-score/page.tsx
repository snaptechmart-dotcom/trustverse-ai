"use client";

import { useState } from "react";

export default function TrustScoreTool() {
  const [input, setInput] = useState("");
  const [score, setScore] = useState<number | null>(null);
  const [risk, setRisk] = useState<string>("");

  const analyzeTrust = () => {
    if (!input) return;

    // Dummy AI logic (for demo)
    const generatedScore = Math.floor(Math.random() * 101);
    setScore(generatedScore);

    if (generatedScore >= 70) setRisk("Low Risk");
    else if (generatedScore >= 40) setRisk("Medium Risk");
    else setRisk("High Risk");
  };

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-bold">Trust Score Analyzer</h1>

      {/* Input */}
      <input
        type="text"
        placeholder="Enter phone / username / email"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full border px-4 py-2 rounded"
      />

      {/* Button */}
      <button
        onClick={analyzeTrust}
        className="bg-blue-600 text-white px-6 py-2 rounded"
      >
        Analyze Trust
      </button>

      {/* Result */}
      {score !== null && (
        <div className="border rounded-lg p-4 bg-gray-50">
          <p className="text-lg">
            <strong>Trust Score:</strong>{" "}
            <span className="text-blue-600 font-bold">{score}/100</span>
          </p>

          <p className="mt-2">
            <strong>Risk Level:</strong>{" "}
            <span
              className={
                risk === "Low Risk"
                  ? "text-green-600"
                  : risk === "Medium Risk"
                  ? "text-yellow-600"
                  : "text-red-600"
              }
            >
              {risk}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
