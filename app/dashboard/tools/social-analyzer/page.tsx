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

type ResultType = {
  platform: string;
  accountType: string;
  riskLevel: "Low Risk" | "Medium Risk" | "High Risk";
  remainingCredits: number | "unlimited";
};

export default function SocialAnalyzerTool() {
  const [username, setUsername] = useState("");
  const [platform, setPlatform] = useState(platforms[0]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResultType | null>(null);

  const analyzeProfile = async () => {
    if (!username.trim()) {
      alert("Please enter a username or profile link.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/social-analyzer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform,
          username: username.trim(),
        }),
      });

      if (res.status === 401) {
        alert("Session expired. Please login again.");
        return;
      }

      if (res.status === 402) {
        alert("No credits left. Please upgrade your plan.");
        return;
      }

      if (!res.ok) {
        alert("Service temporarily unavailable. Please try again.");
        return;
      }

      const data = await res.json();

      const accountType = data.analysis.profileExists
        ? "Likely Genuine Account"
        : "Potentially Suspicious Account";

      setResult({
        platform,
        accountType,
        riskLevel: data.analysis.riskLevel,
        remainingCredits: data.remainingCredits,
      });

      // ✅ Clear inputs
      setUsername("");
      setPlatform(platforms[0]);

      window.dispatchEvent(new Event("credits-updated"));
    } catch (err) {
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 max-w-4xl">
      <CreditWarningBanner />

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Social Profile Analyzer
        </h1>
        <p className="text-gray-500 mt-2 max-w-3xl">
          Analyze social media profiles, usernames, or public profile links to
          detect fake accounts, impersonation attempts, or suspicious online
          behavior before engaging.
        </p>
      </div>

      {/* INPUT CARD */}
      <div className="bg-white border rounded-xl p-6 space-y-4 max-w-xl shadow-sm">
        <input
          type="text"
          placeholder="Enter username or profile URL"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full bg-slate-50 border border-slate-300 rounded-md px-4 py-2
          focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          className="w-full bg-slate-50 border border-slate-300 rounded-md px-4 py-2
          focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          {platforms.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        <button
          onClick={analyzeProfile}
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md transition disabled:opacity-60"
        >
          {loading ? "Analyzing..." : "Analyze Profile"}
        </button>
      </div>

      {/* RESULT */}
      {result && (
        <div className="bg-white border rounded-xl p-6 max-w-2xl space-y-4">
          <h3 className="text-xl font-semibold text-gray-900">
            🔍 Trustverse AI Social Verification Report
          </h3>

          <p>
            <strong>Verification Status:</strong>{" "}
            <span className="text-emerald-600 font-semibold">
              Successfully Completed ✅
            </span>
          </p>

          <p>
            <strong>Platform:</strong> {result.platform}
          </p>

          <p>
            <strong>Account Type:</strong>{" "}
            <span
              className={
                result.accountType.includes("Genuine")
                  ? "text-green-600 font-bold"
                  : "text-red-600 font-bold"
              }
            >
              {result.accountType}
            </span>
          </p>

          <div className="space-y-2 text-gray-700">
            <p>
              <strong>Risk Assessment Summary:</strong>
            </p>
            <p className="text-sm leading-relaxed">
              Our AI-based system evaluated publicly available signals including
              activity consistency, engagement behavior, and common impersonation
              indicators. Based on this analysis, the profile demonstrates a{" "}
              <strong>{result.riskLevel}</strong> risk level.
            </p>
          </div>

          <p>
            <strong>Final Risk Level:</strong>{" "}
            <span
              className={
                result.riskLevel === "Low Risk"
                  ? "text-green-600 font-bold"
                  : result.riskLevel === "Medium Risk"
                  ? "text-yellow-600 font-bold"
                  : "text-red-600 font-bold"
              }
            >
              {result.riskLevel}
            </span>
          </p>

          <div className="border-t pt-4 text-sm text-gray-600">
            <p>
              <strong>Credits Used:</strong> 1
            </p>
            <p>
              <strong>Available Credits:</strong>{" "}
              {result.remainingCredits === "unlimited"
                ? "Unlimited"
                : result.remainingCredits}
            </p>
          </div>

          <p className="text-xs text-gray-500 italic">
            This result is generated using automated indicators and is intended
            for guidance only. Always consider additional verification before
            taking critical actions.
          </p>
        </div>
      )}

      {/* DESCRIPTION */}
      <div className="space-y-6 text-gray-700 max-w-3xl">
        <h2 className="text-xl font-semibold text-gray-900">
          How Social Profile Analyzer Works
        </h2>

        <p>
          Social Profile Analyzer helps assess the trustworthiness of public
          social media accounts by evaluating multiple automated risk indicators.
          It is designed to reduce exposure to fake profiles, scams, and online
          impersonation attempts.
        </p>

        <ul className="list-disc pl-6 space-y-2">
          <li>Detect fake or impersonation accounts</li>
          <li>Identify abnormal or suspicious activity patterns</li>
          <li>Improve online safety before interaction or collaboration</li>
        </ul>

        <p className="text-sm text-gray-500">
          Disclaimer: Trustverse AI provides automated insights for guidance
          purposes only and does not guarantee accuracy. Users should apply
          independent judgment when making decisions.
        </p>
      </div>
    </div>
  );
}
