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

  const analyzeProfile = async () => {
    if (!username) return;

    const genuine = Math.random() > 0.45;
    const accountText = genuine
      ? "Genuine Account"
      : "Suspicious Account";

    const r = Math.random();
    let riskText = "High Risk";
    if (r > 0.7) riskText = "Low Risk";
    else if (r > 0.4) riskText = "Medium Risk";

    setAccountType(accountText);
    setRisk(riskText);

    // 🧠 SAVE HISTORY
    try {
      await fetch("/api/save-history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "Social Analyzer",
          input: `${platform} : ${username}`,
          result: `${accountText} - ${riskText}`,
        }),
      });
    } catch (err) {
      console.error("History save failed", err);
    }
  };

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-bold">Social Analyzer</h1>

      <input
        type="text"
        placeholder="Enter username / profile ID"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full border px-4 py-2 rounded"
      />

      <select
        value={platform}
        onChange={(e) => setPlatform(e.target.value)}
        className="w-full border px-4 py-2 rounded"
      >
        {platforms.map((p) => (
          <option key={p}>{p}</option>
        ))}
      </select>

      <button
        onClick={analyzeProfile}
        className="bg-purple-600 text-white px-6 py-2 rounded"
      >
        Analyze Profile
      </button>

      {accountType && (
        <div className="border rounded-lg p-4 bg-gray-50">
          <p>
            <strong>Account:</strong> {accountType}
          </p>
          <p className="mt-2">
            <strong>Risk:</strong> {risk}
          </p>
        </div>
      )}
    </div>
  );
}
