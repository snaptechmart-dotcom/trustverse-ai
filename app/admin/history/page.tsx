"use client";

import { useEffect, useState } from "react";

interface HistoryItem {
  _id: string;
  userId: string;
  action: string;
  impact: number;
  reason: string;
  createdAt: string;
}

export default function AdminHistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/history")
      .then((res) => res.json())
      .then((data) => setHistory(data.history || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-6">Loading history...</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Admin Activity History</h1>

      {history.length === 0 ? (
        <p className="text-gray-500">No activity found.</p>
      ) : (
        <div className="space-y-4">
          {history.map((h) => (
            <div
              key={h._id}
              className="border rounded-lg p-4 bg-white shadow-sm"
            >
              <p className="font-semibold">{h.action}</p>

              <p className="text-sm text-gray-600">
                Reason: {h.reason}
              </p>

              <p className="text-xs text-gray-400">
                User ID: {h.userId}
              </p>

              <p className="text-xs mt-1">
                Impact:{" "}
                <span
                  className={
                    h.impact < 0
                      ? "text-red-600 font-semibold"
                      : "text-green-600 font-semibold"
                  }
                >
                  {h.impact}
                </span>
              </p>

              <p className="text-xs text-gray-400 mt-1">
                {new Date(h.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
