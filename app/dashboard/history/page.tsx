"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/* =========================
   TYPES
========================= */
type HistoryItem = {
  id: string;
  tool: string;
  input: any;
  result?: {
    trustScore?: number;
    riskLevel?: string;
  };
  createdAt: string;
};

/* =========================
   TOOL LABELS
========================= */
const TOOL_LABELS: Record<string, string> = {
  phone_checker: "Phone Number Checker",
  email_checker: "Email Address Checker",
  profile_checker: "Profile Trust Checker",
  business_checker: "Business / Domain Checker",
  social_analyzer: "Social Analyzer",
  advanced_ai_analysis: "Advanced AI Analysis",
  trust_score: "Trust Score Analyzer",
  TRUST_SCORE: "Trust Score Analyzer",
};

/* =========================
   TOOL ICONS
========================= */
const TOOL_ICONS: Record<string, string> = {
  phone_checker: "📞",
  email_checker: "📧",
  profile_checker: "👤",
  business_checker: "🏢",
  social_analyzer: "🌐",
  advanced_ai_analysis: "🤖",
  trust_score: "🧠",
  TRUST_SCORE: "🧠",
};

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await fetch("/api/history", {
          credentials: "include",
          cache: "no-store",
        });

        const data = await res.json();

        /* =========================
           ✅ FINAL SAFE HANDLING
        ========================= */
        if (Array.isArray(data)) {
          // backward safety
          setHistory(data);
        } else if (data?.success && Array.isArray(data.history)) {
          // ✅ correct current API
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

  if (loading) {
    return <div className="text-gray-500">Loading reports…</div>;
  }

  if (!history.length) {
    return (
      <div className="text-gray-500">
        No reports yet. Start using Trustverse AI tools.
      </div>
    );
  }

  return (
    <div className="max-w-5xl space-y-6">
      <h1 className="text-2xl font-bold">
        Your Trustverse AI Reports
      </h1>

      {history.map((item) => {
        const trustScore =
          typeof item.result?.trustScore === "number"
            ? item.result.trustScore
            : null;

        const riskLevel =
          item.result?.riskLevel ?? "Completed";

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
            key={item.id}
            className={`bg-white border-l-4 ${borderColor} rounded-xl p-5 shadow-sm space-y-3`}
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">
                {TOOL_ICONS[item.tool] || "🧩"}
              </span>
              <h3 className="font-semibold">
                {TOOL_LABELS[item.tool] || item.tool}
              </h3>
            </div>

            <p className="text-sm text-gray-700 break-words">
              <b>Input:</b>{" "}
              {typeof item.input === "string"
                ? item.input
                : JSON.stringify(item.input)}
            </p>

            {trustScore !== null && (
              <p className="font-semibold">
                Trust Score:{" "}
                <span className="text-blue-600">
                  {trustScore}/100
                </span>
              </p>
            )}

            <p className="text-sm font-semibold">
              {riskLevel}
            </p>

            <button
              onClick={() =>
                router.push(`/dashboard/history/${item.id}`)
              }
              className="text-blue-600 text-sm hover:underline"
            >
              View Full Report →
            </button>

            <p className="text-xs text-gray-400">
              {new Date(item.createdAt).toLocaleString()}
            </p>
          </div>
        );
      })}
    </div>
  );
}
