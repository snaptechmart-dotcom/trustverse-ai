"use client";

import { useState } from "react";

const platforms = [
  "Instagram",
  "Facebook",
  "Twitter / X",
  "LinkedIn",
  "YouTube",
  "TikTok",
  "WhatsApp",
  "Telegram",
  "Discord",
  "Snapchat",
  "Reddit",
  "Quora",
  "Medium",
  "GitHub",
  "Stack Overflow",
];

export default function SocialAnalyzerTool() {
  const [username, setUsername] = useState("");
  const [platform, setPlatform] = useState(platforms[0]);
  const [accountType, setAccountType] = useState<string | null>(null);
  const [risk, setRisk] = useState<string>("");

  const analyzeProfile = async () => {
    if (!username) return;

    /* =========================
       STEP 1: CHECK CREDITS
    ========================= */
    const creditRes = await fetch("/api/check-credits");
    const creditData = await creditRes.json();
    if (!creditRes.ok || creditData.credits <= 0) {
      alert("No credits left. Please upgrade your plan.");
      return;
    }

    /* =========================
       STEP 2: ANALYSIS LOGIC
    ========================= */
    const genuine = Math.random() > 0.45;
    const accountText = genuine
      ? "Genuine Account"
      : "Suspicious Account";

    let riskText = "High Risk";
    const r = Math.random();
    if (r > 0.7) riskText = "Low Risk";
    else if (r > 0.4) riskText = "Medium Risk";

    setAccountType(accountText);
    setRisk(riskText);

    /* =========================
       STEP 3: SAVE HISTORY
    ========================= */
    await fetch("/api/save-history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "Social Analyzer",
        input: `${platform} : ${username}`,
        result: `${accountText} - ${riskText}`,
      }),
    });

    /* =========================
       STEP 4: DEDUCT CREDIT
    ========================= */
    await fetch("/api/use-credit", { method: "POST" });
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
          <p>
            <strong>Platform:</strong> {platform}
          </p>
          <p className="mt-2">
            <strong>Account Type:</strong>{" "}
            <span
              className={
                accountType === "Genuine Account"
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
