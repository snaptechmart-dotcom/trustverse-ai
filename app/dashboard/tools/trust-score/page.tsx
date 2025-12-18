"use client";

import { useState } from "react";

export default function TrustScoreTool() {
  const [input, setInput] = useState("");
  const [score, setScore] = useState<number | null>(null);
  const [risk, setRisk] = useState<string>("");

  const analyzeTrust = async () => {
    if (!input) return;

    /* =========================
       STEP 1: CHECK CREDITS
    ========================= */
    try {
      const creditRes = await fetch("/api/check-credits");
      const creditData = await creditRes.json();

      if (!creditRes.ok || creditData.credits <= 0) {
        alert("No credits left. Please upgrade your plan.");
        return;
      }
    } catch (err) {
      alert("Unable to verify credits. Try again.");
      return;
    }

    /* =========================
       STEP 2: TRUST SCORE LOGIC
    ========================= */
    let calculatedScore = 50;
    const value = input.toLowerCase();

    // 📱 Phone number based logic
    if (/^\d{10}$/.test(value)) {
      if (value.startsWith("9")) calculatedScore = 80;
      else if (value.startsWith("8")) calculatedScore = 65;
      else if (value.startsWith("7")) calculatedScore = 45;
      else calculatedScore = 30;
    }

    // 📧 Email based logic
    else if (value.includes("@")) {
      if (value.includes("test") || value.includes("fake"))
        calculatedScore = 25;
      else if (value.endsWith(".edu") || value.endsWith(".org"))
        calculatedScore = 85;
      else calculatedScore = 60;
    }

    // 👤 Username based logic
    else {
      if (value.length < 5) calculatedScore = 40;
      else if (value.length < 8) calculatedScore = 60;
      else calculatedScore = 75;
    }

    let calculatedRisk = "High Risk";
    if (calculatedScore >= 70) calculatedRisk = "Low Risk";
    else if (calculatedScore >= 40) calculatedRisk = "Medium Risk";

    setScore(calculatedScore);
    setRisk(calculatedRisk);

    /* =========================
       STEP 3: SAVE HISTORY
    ========================= */
    try {
      await fetch("/api/save-history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "Trust Score Analyzer",
          input: input,
          result: `${calculatedScore}/100 - ${calculatedRisk}`,
        }),
      });
    } catch (error) {
      console.error("Failed to save history", error);
    }

    /* =========================
       STEP 4: DEDUCT CREDIT
    ========================= */
    try {
      await fetch("/api/use-credit", {
        method: "POST",
      });
    } catch (error) {
      console.error("Failed to deduct credit", error);
    }
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
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
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
                  ? "text-green-600 font-bold"
                  : risk === "Medium Risk"
                  ? "text-yellow-600 font-bold"
                  : "text-red-600 font-bold"
              }
            >
              {risk}
            </span>
          </p>

          <p className="mt-3 text-sm text-gray-600">
            Result generated using multiple trust signals (demo AI logic).
          </p>
        </div>
      )}
    </div>
  );
}
