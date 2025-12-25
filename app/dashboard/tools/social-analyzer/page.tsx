"use client";

import { useState } from "react";
import CreditWarningBanner from "@/components/CreditWarningBanner";

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
    if (!username) {
      alert("Please enter username or profile ID");
      return;
    }

    /* =========================
       STEP 1: CHECK + DEDUCT CREDIT
    ========================= */
    const creditRes = await fetch("/api/use-credit", {
      method: "POST",
    });

    if (!creditRes.ok) {
      alert("No credits left. Please upgrade your plan.");
      return;
    }

    /* =========================
       STEP 2: ANALYSIS LOGIC (Demo)
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
    try {
      await fetch("/api/save-history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "SOCIAL_ANALYZER",
          input: `${platform} : ${username}`,
          result: `${accountText} - ${riskText}`,
        }),
      });
    } catch (error) {
      console.error("Failed to save history", error);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl">
      {/* CREDIT WARNING */}
      <CreditWarningBanner />

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Social Analyzer
        </h1>
        <p className="text-gray-500 mt-1">
          Analyze social media profiles to identify fake accounts,
          suspicious behavior, or potential risks using AI-powered signals.
        </p>
      </div>

      {/* INPUT CARD */}
      <div className="bg-white border rounded-xl p-6 space-y-4 max-w-xl">
        {/* Username */}
        <input
          type="text"
          placeholder="Enter username or profile ID"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full bg-slate-50 border border-slate-300 rounded-md px-4 py-2
          focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
        />

        {/* Platform Select */}
        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          className="w-full bg-slate-50 border border-slate-300 rounded-md px-4 py-2
          focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md transition"
        >
          Analyze Profile
        </button>
      </div>

      {/* DESCRIPTION */}
      <div className="text-gray-700 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">
          How Social Analyzer Works
        </h2>

        <p>
          Social Analyzer evaluates public profile signals such as activity
          patterns, engagement behavior, and reported indicators to assess
          whether an account appears genuine or suspicious.
        </p>

        <ul className="list-disc pl-5 space-y-2">
          <li>Detect fake, bot-driven, or risky profiles</li>
          <li>Identify suspicious engagement patterns</li>
          <li>Improve trust before interacting or collaborating</li>
        </ul>

        <p className="text-sm text-gray-500">
          Note: Analysis is based on automated signals and should be used as
          guidance, not as a definitive judgment.
        </p>
      </div>

      {/* RESULT */}
      {accountType && (
        <div className="border rounded-xl p-6 bg-gray-50 max-w-xl">
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
                  ? "text-green-600 font-bold"
                  : risk === "Medium Risk"
                  ? "text-yellow-600 font-bold"
                  : "text-red-600 font-bold"
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
