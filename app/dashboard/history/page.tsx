"use client";

import { useEffect, useState } from "react";

interface HistoryItem {
  _id: string;
  action: string;
  impact: number;
  reason: string;
  createdAt: string;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      try {
        const res = await fetch("/api/history", { cache: "no-store" });
        const data = await res.json();
        setHistory(data.history || []);
      } catch {
        console.error("Failed to load history");
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, []);

  if (loading) {
    return <div className="p-4">Loading history...</div>;
  }

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold">Your Activity History</h1>

      {history.length === 0 ? (
        <p className="text-sm text-gray-500">No activity found.</p>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <div
              key={item._id}
              className="border rounded-lg p-4 bg-white space-y-2"
            >
              {/* ACTION + IMPACT */}
              <div className="flex justify-between items-start gap-2">
                <p className="font-semibold text-sm break-words">
                  {item.action}
                </p>

                <span
                  className={`text-xs font-bold px-2 py-1 rounded-full ${
                    item.impact < 0
                      ? "bg-red-100 text-red-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  {item.impact}
                </span>
              </div>

              {/* REASON */}
              <p className="text-sm text-gray-600 break-words">
                {item.reason}
              </p>

              {/* DATE */}
              <p className="text-xs text-gray-400">
                {new Date(item.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
