"use client";

import { useEffect, useState } from "react";

/* =========================
   TYPES
========================= */
type HistoryItem = {
  _id: string;
  tool: string;
  input?: string;
  riskLevel?: string;
  trustScore?: number;
  signals?: string[];
  createdAt: string;
};

/* =========================
   TOOL LABELS & ICONS
========================= */
const TOOL_LABELS: Record<string, string> = {
  TRUST_SCORE: "Trust Score Analyzer",
  PHONE_CHECK: "Phone Number Checker",
  EMAIL_CHECK: "Email Address Checker",
  PROFILE_CHECK: "Profile Trust Checker",
  BUSINESS_DOMAIN: "Business / Domain Checker",
  SOCIAL_ANALYZER: "Social Analyzer",
  ADVANCED_ANALYSIS: "Advanced AI Analysis",
};

const TOOL_ICONS: Record<string, string> = {
  TRUST_SCORE: "🔐",
  PHONE_CHECK: "📞",
  EMAIL_CHECK: "📧",
  PROFILE_CHECK: "👤",
  BUSINESS_DOMAIN: "🏢",
  SOCIAL_ANALYZER: "🌐",
  ADVANCED_ANALYSIS: "🤖",
};

/* =========================
   TOOL DESCRIPTIONS
========================= */
const TOOL_DESCRIPTIONS: Record<string, string> = {
  TRUST_SCORE: "AI-based trustworthiness evaluation",
  PHONE_CHECK: "Phone number spam & risk analysis",
  EMAIL_CHECK: "Email reputation & breach analysis",
  PROFILE_CHECK: "Identity & profile trust validation",
  BUSINESS_DOMAIN: "Business & domain credibility check",
  SOCIAL_ANALYZER: "Social profile activity & risk scan",
  ADVANCED_ANALYSIS: "Deep AI intent & risk analysis",
};

/* =========================
   COMPONENT
========================= */
export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadHistory = async () => {
    try {
      const res = await fetch("/api/history", {
        credentials: "include",
        cache: "no-store",
      });

      if (!res.ok) {
        setHistory([]);
        return;
      }

      const data = await res.json();
      setHistory(Array.isArray(data.history) ? data.history : []);
    } catch (err) {
      console.error("History load error 👉", err);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();

    // 🔥 Real-time refresh support
    const listener = () => loadHistory();
    window.addEventListener("history-updated", listener);

    return () => {
      window.removeEventListener("history-updated", listener);
    };
  }, []);

  /* =========================
     STATES
  ========================= */
  if (loading) {
    return (
      <p className="text-gray-500 text-sm">
        Loading history…
      </p>
    );
  }

  if (!history.length) {
    return (
      <p className="text-gray-500 text-sm">
        No activity yet. Start using Trustverse AI tools 🚀
      </p>
    );
  }

  /* =========================
     UI
  ========================= */
  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900">
        Your Activity History
      </h1>

      {history.map((item) => (
        <div
          key={item._id}
          className="bg-white border-l-4 border-blue-500 rounded-xl p-5 space-y-3 shadow-sm hover:shadow-md transition"
        >
          {/* TOOL HEADER */}
          <div className="flex items-center gap-2">
            <span className="text-lg">
              {TOOL_ICONS[item.tool] || "🧩"}
            </span>
            <h3 className="font-semibold text-gray-900">
              {TOOL_LABELS[item.tool] || item.tool}
            </h3>
          </div>

          {/* TOOL DESCRIPTION */}
          <p className="text-xs text-gray-500">
            {TOOL_DESCRIPTIONS[item.tool] || ""}
          </p>

          {/* INPUT */}
          {item.input && (
            <p className="text-sm text-gray-700 break-words">
              <strong>Input:</strong> {item.input}
            </p>
          )}

          {/* RISK + TRUST SCORE */}
          <div className="flex items-center gap-4">
            {item.riskLevel && (
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  item.riskLevel === "Low Risk"
                    ? "bg-green-100 text-green-700"
                    : item.riskLevel === "Medium Risk"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {item.riskLevel}
              </span>
            )}

            {typeof item.trustScore === "number" && (
              <span className="text-sm font-semibold">
                Trust Score:
                <span
                  className={
                    item.trustScore >= 80
                      ? "text-green-600"
                      : item.trustScore >= 60
                      ? "text-yellow-600"
                      : "text-red-600"
                  }
                >
                  {" "}
                  {item.trustScore}/100
                </span>
              </span>
            )}
          </div>

          {/* DATE */}
          <p className="text-[11px] text-gray-400 italic">
            {new Date(item.createdAt).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}
