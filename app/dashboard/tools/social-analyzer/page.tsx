"use client";

import { useState } from "react";

export default function SocialAnalyzerTool() {
  const [username, setUsername] = useState("");
  const [platform, setPlatform] = useState("Instagram");
  const [accountType, setAccountType] = useState<string | null>(null);
  const [risk, setRisk] = useState<string>("");

  const analyzeProfile = () => {
    if (!username) return;

    // Dummy AI logic
    const isGenuine = Math.random() > 0.4;
    setAccountType(isGenuine ? "Genuine Account" : "Suspicious Account");

    const rand = Math.random();
    if (rand > 0.7) setRisk("Low Risk");
    else if (rand > 0.4) setRisk("Medium Risk");
    else setRisk("High Risk");
  };

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-bold">Social Analyzer</h1>

      {/* Username */}
      <input
        type="text"
        placeholder="Enter username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full border px-4 py-2 rounded"
      />

      {/* Platform Select */}
      <select
        value={platform}
        onChange={(e) => setPlatform(e.target.value)}
        className="w-full border px-4 py-2 rounded"
      >
        <option>Instagram</option>
        <option>Twitter</option>
        <option>LinkedIn</option>
      </select>

      {/* Button */}
      <button
        onClick={analyzeProfile}
        className="bg-purple-600 text-white px-6 py-2 rounded"
      >
        Analyze Profile
      </button>

      {/* Result */}
      {accountType && (
        <div className="border rounded-lg p-4 bg-gray-50">
          <p className="text-lg">
            <strong>Platform:</strong> {platform}
          </p>

          <p className="mt-2">
            <strong>Account Type:</strong>{" "}
            <span
              className={
                accountType.includes("Genuine")
                  ? "text-green-600 font-bold"
                  : "text-red-600 font-bold"
              }
            >
              {accountType}
            </span>
          </p>

          <p className="mt-2">
            <strong>Risk Level:</strong>{" "}
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
