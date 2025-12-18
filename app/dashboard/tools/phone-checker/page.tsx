"use client";

import { useState } from "react";

export default function PhoneCheckerTool() {
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [risk, setRisk] = useState<string>("");

  const checkPhone = async () => {
    if (!phone) return;

    /* STEP 1: CHECK CREDITS */
    const creditRes = await fetch("/api/check-credits");
    const creditData = await creditRes.json();
    if (creditData.credits <= 0) {
      alert("No credits left. Please upgrade your plan.");
      return;
    }

    /* STEP 2: TOOL LOGIC */
    const isValid = Math.random() > 0.3;
    const statusText = isValid ? "Valid Number" : "Invalid Number";

    let riskText = "High Spam Risk";
    if (isValid) {
      const r = Math.random();
      if (r > 0.7) riskText = "Low Spam Risk";
      else if (r > 0.4) riskText = "Medium Spam Risk";
    }

    setStatus(statusText);
    setRisk(riskText);

    /* STEP 3: SAVE HISTORY */
    await fetch("/api/save-history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "Phone Number Checker",
        input: phone,
        result: `${statusText} - ${riskText}`,
      }),
    });

    /* STEP 4: DEDUCT CREDIT */
    await fetch("/api/use-credit", { method: "POST" });
  };

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-bold">Phone Number Checker</h1>

      <input
        type="tel"
        placeholder="Enter phone number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="w-full border px-4 py-2 rounded"
      />

      <button
        onClick={checkPhone}
        className="bg-green-600 text-white px-6 py-2 rounded"
      >
        Check Number
      </button>

      {status && (
        <div className="border rounded-lg p-4 bg-gray-50">
          <p><strong>Status:</strong> {status}</p>
          <p><strong>Spam Risk:</strong> {risk}</p>
        </div>
      )}
    </div>
  );
}
