"use client";

import { useEffect, useState } from "react";

type HistoryItem = {
  _id: string;
  tool: string;
  input: any;
  result: any;
  createdAt: string;
};

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("/api/history");
        if (!res.ok) return;
        const data = await res.json();
        setHistory(data);
      } catch (err) {
        console.error("History fetch failed");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="space-y-8 max-w-5xl">
      <h1 className="text-2xl font-bold">Your Activity History</h1>

      {loading && <p className="text-gray-500">Loading history...</p>}

      {!loading && history.length === 0 && (
        <p className="text-gray-500">
          No activity found. Start using tools to see history here.
        </p>
      )}

      <div className="space-y-4">
        {history.map((item) => (
          <div
            key={item._id}
            className="bg-white border rounded-xl p-5 space-y-2"
          >
            <p className="text-sm text-gray-500">
              {new Date(item.createdAt).toLocaleString()}
            </p>

            <p className="font-semibold capitalize">
              Tool: {item.tool.replace("-", " ")}
            </p>

            <p className="text-sm text-gray-700">
              <strong>Input:</strong>{" "}
              {JSON.stringify(item.input)}
            </p>

            <p className="text-sm text-gray-700">
              <strong>Result:</strong>{" "}
              {JSON.stringify(item.result)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
