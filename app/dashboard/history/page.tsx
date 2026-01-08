"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type HistoryItem = {
  _id: string;
  tool: string;
  query?: string;
  input?: string;
  result?: any;
  createdAt: string;
};

const TOOL_LABELS: Record<string, string> = {
  BUSINESS_CHECK: "Business / Domain Checker",
  EMAIL_CHECK: "Email Checker",
  PHONE_CHECK: "Phone Checker",
};

const TOOL_ICONS: Record<string, string> = {
  BUSINESS_CHECK: "🏢",
  EMAIL_CHECK: "📧",
  PHONE_CHECK: "📞",
};

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/history", {
          credentials: "include",
          cache: "no-store",
        });
        const data = await res.json();
        setHistory(Array.isArray(data.history) ? data.history : []);
      } catch {
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <p className="text-gray-500">Loading history…</p>;
  if (!history.length)
    return <p className="text-gray-500">No activity yet.</p>;

  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-2xl font-bold">Your Activity History</h1>

      {history.map((item) => {
        const trustScore =
          item.result?.score ??
          item.result?.trustScore ??
          null;

        const riskLevel =
          item.result?.riskLevel ||
          item.result?.risk ||
          "Unknown";

        const borderColor =
          riskLevel === "Low Risk"
            ? "border-green-500"
            : riskLevel === "Medium Risk"
            ? "border-yellow-500"
            : "border-red-500";

        return (
          <div
            key={item._id}
            className={`bg-white border-l-4 ${borderColor} rounded-xl p-5 space-y-3 shadow-sm hover:shadow-md transition`}
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
              <strong>Input:</strong> {item.query || item.input}
            </p>

            {/* SCORE */}
            {typeof trustScore === "number" && (
              <p className="font-semibold">
                Trust Score:{" "}
                <span className="text-blue-600">
                  {trustScore}/100
                </span>
              </p>
            )}

            {/* RISK */}
            <p
              className={`text-sm font-semibold ${
                riskLevel === "Low Risk"
                  ? "text-green-600"
                  : riskLevel === "Medium Risk"
                  ? "text-yellow-600"
                  : "text-red-600"
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

            <p className="text-xs text-gray-400">
              {new Date(item.createdAt).toLocaleString()}
            </p>
          </div>
        );
      })}
    </div>
  );
}
