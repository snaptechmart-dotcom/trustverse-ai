"use client";

import { useEffect, useState } from "react";

export default function HistoryPage() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const response = await fetch("/api/history-chart");
        const data = await response.json();

        setHistory(data.history || []);
      } catch (error) {
        console.error("Error fetching history:", error);
      }
    }

    fetchHistory();
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Your Activity History</h1>

      {history.length === 0 ? (
        <p className="text-gray-500">No activity found.</p>
      ) : (
        <div className="space-y-4">
          {history.map((item, index) => (
            <div
              key={index}
              className="p-4 bg-white shadow rounded-lg border border-gray-100"
            >
              <h2 className="text-lg font-semibold">{item.type}</h2>
              <p className="text-gray-600">{item.input}</p>
              <p className="text-sm text-gray-400 mt-1">
                {new Date(item.date).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
