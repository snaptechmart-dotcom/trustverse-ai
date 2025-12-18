"use client";

import { useState } from "react";

const platforms = [
  "Instagram",
  "Facebook",
  "Twitter / X",
  "LinkedIn",
  "YouTube",
  "TikTok",
  "Snapchat",
  "Telegram",
  "Reddit",
  "GitHub",
];

export default function SocialAnalyzerTool() {
  const [username, setUsername] = useState("");
  const [platform, setPlatform] = useState(platforms[0]);
  const [accountType, setAccountType] = useState<string | null>(null);
  const [risk, setRisk] = useState<string>("");

  const analyzeProfile = () => {
    if (!username) return;

    // Demo AI logic
    const genuine = Math.random() > 0.45;
    setAccountType(genuine ? "Genuine Account" : "Suspicious Account");

    const r = Math.random();
    if (r > 0.7) setRisk("Low Risk");
    else if (r > 0.4) setRisk("Medium Risk");
    else setRisk("High Risk");
  };

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-bold">Social Analyzer</h1>

      {/* Username */}
      <input
        type="text"
        placeholder="Enter username / profile ID"
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
        {platforms.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>

      {/* Button */}
      <button
        onClick={analyzeProfile}
        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded"
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
