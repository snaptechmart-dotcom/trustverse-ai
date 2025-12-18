"use client";

import { useState } from "react";

export default function PhoneCheckerTool() {
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [risk, setRisk] = useState<string>("");

  const checkPhone = () => {
    if (!phone) return;

    // Dummy validation logic
    const isValid = Math.random() > 0.3;
    setStatus(isValid ? "Valid Number" : "Invalid Number");

    if (!isValid) {
      setRisk("High Risk");
    } else {
      const rand = Math.random();
      if (rand > 0.7) setRisk("Low Spam Risk");
      else if (rand > 0.4) setRisk("Medium Spam Risk");
      else setRisk("High Spam Risk");
    }
  };

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-bold">Phone Number Checker</h1>

      {/* Input */}
      <input
        type="tel"
        placeholder="Enter phone number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="w-full border px-4 py-2 rounded"
      />

      {/* Button */}
      <button
        onClick={checkPhone}
        className="bg-green-600 text-white px-6 py-2 rounded"
      >
        Check Number
      </button>

      {/* Result */}
      {status && (
        <div className="border rounded-lg p-4 bg-gray-50">
          <p className="text-lg">
            <strong>Status:</strong>{" "}
            <span
              className={
                status === "Valid Number"
                  ? "text-green-600 font-bold"
                  : "text-red-600 font-bold"
              }
            >
              {status}
            </span>
          </p>

          <p className="mt-2">
            <strong>Spam Risk:</strong>{" "}
            <span
              className={
                risk.includes("Low")
                  ? "text-green-600"
                  : risk.includes("Medium")
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
