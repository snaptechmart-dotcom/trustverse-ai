"use client";

import { useEffect, useState } from "react";

type ScamHistory = {
  _id: string;
  userEmail: string;
  action: string;
  impact: number;
  reason: string;
  createdAt: string;
};

export default function AdminScamHistoryPage() {
  const [history, setHistory] = useState<ScamHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔍 Filters
  const [search, setSearch] = useState("");
  const [impact, setImpact] = useState("All");

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (search.trim()) params.append("search", search.trim());
      if (impact !== "All") params.append("impact", impact);

      const res = await fetch(
        `/api/admin/scam-history?${params.toString()}`
      );

      const data = await res.json();

      // ✅ Safety check
      if (!Array.isArray(data)) {
        console.error("Expected array, got:", data);
        setHistory([]);
        setError("No scam history available.");
        return;
      }

      setHistory(data);
    } catch (err) {
      console.error("Failed to fetch scam history:", err);
      setError("Failed to load scam history.");
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Auto refresh on filter change
  useEffect(() => {
    fetchHistory();
  }, [search, impact]);

  if (loading) {
    return <p className="p-6">Loading scam history...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">
        📜 Admin – Scam Reports History
      </h1>

      <p className="text-gray-600 mb-6">
        This page shows all resolved scam reports generated from AI tools,
        including trust score impact and resolution reason.
      </p>

      {/* 🔍 FILTER BAR */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search email or reason..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-64"
        />

        <select
          value={impact}
          onChange={(e) => setImpact(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="All">All Impact</option>
          <option value="-10">-10</option>
          <option value="-20">-20</option>
          <option value="-30">-30</option>
        </select>
      </div>

      {error && (
        <div className="mb-4 text-red-600 font-medium">
          {error}
        </div>
      )}

      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-2">User Email</th>
            <th className="border px-2 py-2">Action</th>
            <th className="border px-2 py-2">Impact</th>
            <th className="border px-2 py-2">Reason</th>
            <th className="border px-2 py-2">Date</th>
          </tr>
        </thead>

        <tbody>
          {history.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="border px-2 py-4 text-center text-gray-500"
              >
                No scam history found.
              </td>
            </tr>
          ) : (
            history.map((h) => (
              <tr key={h._id}>
                <td className="border px-2 py-2">{h.userEmail}</td>
                <td className="border px-2 py-2">{h.action}</td>
                <td
                  className={`border px-2 py-2 font-semibold ${
                    h.impact < 0
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {h.impact}
                </td>
                <td className="border px-2 py-2">{h.reason}</td>
                <td className="border px-2 py-2">
                  {new Date(h.createdAt).toLocaleString()}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
