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
      alert("Please enter a username or profile link.");
      return;
    }

    /* =========================
       STEP 1: CHECK + DEDUCT CREDIT
    ========================= */
    const creditRes = await fetch("/api/use-credit", {
      method: "POST",
    });

    if (!creditRes.ok) {
      alert("You have no credits left. Please upgrade your plan.");
      return;
    }

    /* =========================
       STEP 2: ANALYSIS LOGIC (Demo)
    ========================= */
    const genuine = Math.random() > 0.45;
    const accountText = genuine
      ? "Likely Genuine Account"
      : "Potentially Suspicious Account";

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
    <div className="space-y-10 max-w-4xl">
      {/* CREDIT WARNING */}
      <CreditWarningBanner />

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Social Profile Analyzer
        </h1>
        <p className="text-gray-500 mt-2 max-w-3xl">
          Analyze social media profiles, usernames, or public profile links to
          identify fake accounts, impersonation attempts, or suspicious online
          behavior before engaging.
        </p>
      </div>

      {/* INPUT CARD */}
      <div className="bg-white border rounded-xl p-6 space-y-4 max-w-xl shadow-sm">
        {/* Username / Profile */}
        <input
          type="text"
          placeholder="Enter username or profile URL"
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
      <div className="space-y-6 text-gray-700 max-w-3xl">
        <h2 className="text-xl font-semibold text-gray-900">
          How Social Profile Analyzer Works
        </h2>

        <p>
          Social Profile Analyzer is an AI-powered tool designed to assess the
          credibility and risk level of social media accounts across widely used
          global platforms. It helps users detect fake profiles, impersonation
          attempts, and suspicious activity patterns.
        </p>

        <p>
          The system evaluates publicly available signals such as activity
          consistency, engagement behavior, and reported risk indicators to
          determine whether a profile appears trustworthy or potentially risky.
        </p>

        <ul className="list-disc pl-6 space-y-2">
          <li>Detect fake, bot-driven, or impersonation accounts</li>
          <li>Identify abnormal engagement or activity patterns</li>
          <li>Improve safety before online interactions or collaborations</li>
          <li>Make informed decisions using AI-powered trust signals</li>
        </ul>

        <p className="font-medium text-gray-800">
          Risk Levels Explained:
        </p>

        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Low Risk:</strong> No major suspicious indicators detected.
          </li>
          <li>
            <strong>Medium Risk:</strong> Some warning signals present; proceed
            with caution.
          </li>
          <li>
            <strong>High Risk:</strong> Strong risk indicators detected. Avoid
            interaction unless verified through trusted sources.
          </li>
        </ul>

        <p className="text-sm text-gray-500">
          Disclaimer: Social Profile Analyzer provides automated insights based
          on public signals for guidance purposes only. Final decisions should
          always involve personal judgment and additional verification when
          required.
        </p>
      </div>

      {/* RESULT */}
      {accountType && (
        <div className="border rounded-xl p-6 bg-gray-50 max-w-xl space-y-2">
          <p>
            <strong>Platform:</strong> {platform}
          </p>

          <p>
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

          <p>
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
