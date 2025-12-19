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
        const res = await fetch("/api/history", {
          cache: "no-store",
        });
        const data = await res.json();
        setHistory(data.history || []);
      } catch (error) {
        console.error("Failed to load history");
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, []);

  if (loading) {
    return <div className="p-10">Loading history...</div>;
  }

  return (
    <div className="p-6 md:p-10 space-y-6">
      <h1 className="text-2xl font-bold">Your Activity History</h1>

      {history.length === 0 ? (
        <p className="text-gray-500">No activity found.</p>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <div
              key={item._id}
              className="p-4 border rounded-lg bg-white shadow-sm flex justify-between items-start"
            >
              <div>
                <p className="font-semibold">{item.action}</p>
                <p className="text-gray-600">{item.reason}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(item.createdAt).toLocaleString()}
                </p>
              </div>

              <span
                className={`font-bold text-sm px-3 py-1 rounded-full ${
                  item.impact > 0
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {item.impact > 0 ? "+" : ""}
                {item.impact}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
