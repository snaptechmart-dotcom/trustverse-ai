"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/* =========================
   TYPES
========================= */
type HistoryItem = {
  _id: string;
  tool: string;
  input: string;
  summary?: {
    trustScore?: number;
    riskLevel?: string;
  };
  createdAt: string;
};

/* =========================
   TOOL LABELS
========================= */
const TOOL_LABELS: Record<string, string> = {
  TRUST_SCORE: "Trust Score Analyzer",
  PHONE_CHECK: "Phone Number Checker",
  EMAIL_CHECK: "Email Address Checker",
  PROFILE_CHECK: "Profile Trust Checker",
  BUSINESS_CHECK: "Business / Domain Checker",
  SOCIAL_CHECK: "Social Analyzer",
  ADVANCED_AI: "Advanced AI Analysis",
};

/* =========================
   TOOL ICONS
========================= */
const TOOL_ICONS: Record<string, string> = {
  TRUST_SCORE: "🧠",
  PHONE_CHECK: "📞",
  EMAIL_CHECK: "📧",
  PROFILE_CHECK: "👤",
  BUSINESS_CHECK: "🏢",
  SOCIAL_CHECK: "🌐",
  ADVANCED_AI: "🤖",
};

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  /* =========================
     LOAD HISTORY
  ========================= */
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await fetch("/api/history", {
          credentials: "include",
          cache: "no-store",
        });

        const data = await res.json();

        if (data?.success && Array.isArray(data.history)) {
          setHistory(data.history);
        } else {
          setHistory([]);
        }
      } catch (error) {
        console.error("History load failed:", error);
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  /* =========================
     STATES
  ========================= */
  if (loading) {
    return (
      <div className="text-gray-500">
        Loading your Trustverse AI reports…
      </div>
    );
  }

  if (!history.length) {
    return (
      <div className="text-gray-500">
        No reports yet. Start using Trustverse AI tools to generate reports.
      </div>
    );
  }

  /* =========================
     UI
  ========================= */
  return (
    <div className="max-w-5xl space-y-6">
      <h1 className="text-2xl font-bold">
        Your Trustverse AI Reports
      </h1>

      {history.map((item) => {
        const trustScore =
          typeof item.summary?.trustScore === "number"
            ? item.summary.trustScore
            : null;

        const riskLevel =
          item.summary?.riskLevel ?? "Completed";

        const borderColor =
          riskLevel === "Low Risk"
            ? "border-green-500"
            : riskLevel === "Medium Risk"
            ? "border-yellow-500"
            : riskLevel === "High Risk"
            ? "border-red-500"
            : "border-gray-300";

        return (
          <div
            key={item._id}
            className={`bg-white border-l-4 ${borderColor} rounded-xl p-5 shadow-sm space-y-3`}
          >
            {/* HEADER */}
            <div className="flex items-center gap-2">
              <span className="text-xl">
                {TOOL_ICONS[item.tool] || "🧩"}
              </span>
              <h3 className="font-semibold">
                {TOOL_LABELS[item.tool] || item.tool}
              </h3>
            </div>

            {/* INPUT */}
            <p className="text-sm text-gray-700 break-words">
              <b>Input:</b> {item.input}
            </p>

            {/* TRUST SCORE */}
            {trustScore !== null && (
              <p className="font-semibold">
                Trust Score:{" "}
                <span className="text-blue-600">
                  {trustScore}/100
                </span>
              </p>
            )}

            {/* RISK LEVEL */}
            <p
              className={`text-sm font-semibold ${
                riskLevel === "Low Risk"
                  ? "text-green-600"
                  : riskLevel === "Medium Risk"
                  ? "text-yellow-600"
                  : riskLevel === "High Risk"
                  ? "text-red-600"
                  : "text-gray-500"
              }`}
            >
              {riskLevel}
            </p>

            {/* ACTION */}
            <button
              onClick={() =>
                router.push(`/dashboard/history/${item._id}`)
              }
              className="text-blue-600 text-sm hover:underline"
            >
              View Full Report →
            </button>

            {/* DATE */}
            <p className="text-xs text-gray-400">
              {new Date(item.createdAt).toLocaleString()}
            </p>
          </div>
        );
      })}
    </div>
  );
}
