"use client";

import { useEffect, useState } from "react";

type HistoryItem = {
  _id: string;
  prompt: string;
  response: string;
  tool?: string;
  createdAt: string;
};

export default function HistoryPage() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<HistoryItem[]>([]);

  useEffect(() => {
    async function loadHistory() {
      try {
        const res = await fetch("/api/history");
        const data = await res.json();
        setItems(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, []);

  if (loading) {
    return <div className="p-6 text-gray-500">Loading history...</div>;
  }

  if (!items.length) {
    return (
      <div className="p-6 text-gray-500">
        No activity found yet.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">
        Activity History
      </h1>

      <div className="space-y-3">
        {items.map((item) => {
          const result = JSON.parse(item.response || "{}");

          return (
            <div
              key={item._id}
              className="bg-white border rounded-lg p-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-indigo-600">
                  {item.tool || "ACTIVITY"}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(item.createdAt).toLocaleString()}
                </span>
              </div>

              <p className="mt-2 text-sm text-gray-700">
                <strong>Input:</strong> {item.prompt}
              </p>

              {result.trustScore && (
                <p className="mt-1 text-sm">
                  <strong>Trust Score:</strong> {result.trustScore} •{" "}
                  <strong>Risk:</strong> {result.risk}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
