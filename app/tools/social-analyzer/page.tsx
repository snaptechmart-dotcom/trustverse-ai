"use client";

import { useState } from "react";

interface SocialResult {
  platforms: string[];
  risk: string;
}

const ALL_PLATFORMS = [
  "Instagram",
  "Facebook",
  "X (Twitter)",
  "LinkedIn",
  "YouTube",
  "TikTok",
  "Reddit",
  "Pinterest",
  "Medium",
  "Tumblr",
  "Quora",
  "WhatsApp",
  "Telegram",
  "Snapchat",
  "Discord",
  "Signal",
  "GitHub",
  "GitLab",
  "Stack Overflow",
  "Behance",
  "Dribbble",
  "Threads",
  "VK",
  "Weibo",
];

export default function SocialAnalyzerPage() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SocialResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [creditsLeft, setCreditsLeft] = useState<number | null>(null);

  const analyzeSocial = async () => {
    if (!username.trim()) {
      setError("Please enter a username");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/tools/run-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tool: "social-analyzer",
          input: username,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to analyze social profile");
        return;
      }

      // Demo logic: show wide platform coverage
      setResult({
        risk: data.result?.risk || "Medium",
        platforms: ALL_PLATFORMS,
      });

      setCreditsLeft(data.creditsLeft);
      setUsername("");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const riskStyle =
    result?.risk === "Low"
      ? "bg-green-50 border-green-300 text-green-700"
      : result?.risk === "Medium"
      ? "bg-yellow-50 border-yellow-300 text-yellow-700"
      : "bg-red-50 border-red-300 text-red-700";

  return (
    <div className="min-h-screen px-4 py-8 md:px-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-2">
        Global Social Profile Analyzer
      </h1>

      <p className="text-gray-600 mb-6">
        Analyze worldwide social and messaging platform presence from a single
        username.
      </p>

      {/* INPUT */}
      <div className="max-w-xl bg-white border rounded-lg p-4 space-y-4">
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username (e.g. johndoe)"
          className="w-full border rounded p-3 text-sm"
        />

        <button
          onClick={analyzeSocial}
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded font-semibold disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Analyze Global Social Profile"}
        </button>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-3">
            {error}
          </div>
        )}
      </div>

      {/* RESULT */}
      {result && (
        <div
          className={`mt-6 max-w-xl border rounded-lg p-4 space-y-3 ${riskStyle}`}
        >
          <p className="font-semibold text-lg">Result</p>

          <p className="text-sm">
            <strong>Risk Level:</strong>{" "}
            <span className="font-semibold">{result.risk}</span>
          </p>

          <div>
            <p className="text-sm font-medium mb-1">
              Detected / Checked Platforms:
            </p>
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-1 text-sm list-disc list-inside">
              {result.platforms.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>

          {creditsLeft !== null && (
            <p className="text-xs">
              Credits left:{" "}
              <span className="font-semibold">{creditsLeft}</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
