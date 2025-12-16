"use client";

import { useEffect, useState } from "react";

type HistoryItem = {
  _id: string;
  action: string;
  adminEmail?: string;
  profileUsername?: string;
  reason?: string;
  createdAt: string;
};

export default function AdminHistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/admin/history");
      const data = await res.json();
      setHistory(data);
    } catch (err) {
      console.error("Failed to load history", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  if (loading) return <p>Loading history...</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Admin Activity History</h2>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Action</th>
              <th className="p-3 text-left">Profile</th>
              <th className="p-3 text-left">Admin</th>
              <th className="p-3 text-left">Reason</th>
              <th className="p-3 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {history.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  No history found
                </td>
              </tr>
            )}

            {history.map((h) => (
              <tr key={h._id} className="border-t">
                <td className="p-3 font-medium">{h.action}</td>
                <td className="p-3">{h.profileUsername || "—"}</td>
                <td className="p-3">{h.adminEmail || "—"}</td>
                <td className="p-3">{h.reason || "—"}</td>
                <td className="p-3">
                  {new Date(h.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
