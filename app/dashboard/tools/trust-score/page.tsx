"use client";

import { useState } from "react";

export default function TrustScorePage() {
  const [value, setValue] = useState("");

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Trust Score Analyzer
        </h1>
        <p className="text-gray-500 mt-1">
          Analyze the trustworthiness of people, numbers, or profiles using AI
        </p>
      </div>

      {/* INPUT CARD */}
      <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4 max-w-xl">
        <input
          type="text"
          placeholder="Enter phone number, username, or email"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <button
          className="bg-indigo-600 text-white px-5 py-2 rounded-md hover:bg-indigo-700 transition"
        >
          Analyze Trust
        </button>
      </div>

      {/* DESCRIPTION SECTION ✅ */}
      <div className="max-w-3xl text-gray-700 space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">
          How Trust Score Works
        </h2>

        <p>
          Trust Score Analyzer uses AI-powered signals to evaluate the reliability
          and risk level associated with a phone number, username, or email
          address. It helps you make safer decisions before interacting with
          unknown people or profiles.
        </p>

        <p>
          Our system analyzes multiple factors such as historical reports,
          verification patterns, behavioral signals, and public risk indicators
          to generate a clear trust score along with a risk classification.
        </p>

        <ul className="list-disc pl-5 space-y-2">
          <li>Detect potential fraud, spam, or fake identities</li>
          <li>Identify high-risk or suspicious profiles early</li>
          <li>Make informed decisions with AI-backed insights</li>
        </ul>

        <p className="text-sm text-gray-500">
          Note: Trust Score is generated using automated analysis and should be
          used as a guidance tool, not as a definitive judgment.
        </p>
      </div>
    </div>
  );
}
