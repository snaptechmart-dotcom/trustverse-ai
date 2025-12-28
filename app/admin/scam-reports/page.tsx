"use client";

import { useEffect, useState } from "react";

type ScamReport = {
  _id: string;
  reportedEmail: string;
  reportedBy: string;
  reason: string;
  riskLevel: string;
  resolved: boolean;
  createdAt: string;
};

export default function AdminScamReportsPage() {
  const [reports, setReports] = useState<ScamReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔍 Search & Filters
  const [search, setSearch] = useState("");
  const [risk, setRisk] = useState("All");
  const [status, setStatus] = useState("All");

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (risk !== "All") params.append("risk", risk);
      if (status !== "All") params.append("status", status);

      const res = await fetch(
        `/api/admin/scam-reports?${params.toString()}`
      );
      const data = await res.json();

      // ✅ SAFETY CHECK
      if (!Array.isArray(data)) {
        console.error("Expected array, got:", data);
        setReports([]);
        setError("You are not authorized or no data available.");
        return;
      }

      setReports(data);
    } catch (err) {
      console.error("Failed to fetch scam reports:", err);
      setError("Failed to load scam reports.");
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const resolveReport = async (id: string) => {
    if (!confirm("Resolve this scam report?")) return;

    try {
      const res = await fetch("/api/admin/resolve-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportId: id }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data?.error || "Failed to resolve report");
        return;
      }

      fetchReports();
    } catch {
      alert("Network error while resolving report");
    }
  };

  // 🔄 Auto refresh on filter change
  useEffect(() => {
    fetchReports();
  }, [search, risk, status]);

  if (loading) {
    return <p className="p-6">Loading scam reports...</p>;
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">
        🚨 Admin – Scam Reports (AI Tools)
      </h1>

      {/* 🔍 SEARCH & FILTER BAR */}
      <div className="flex flex-wrap gap-3 items-center">
        <input
          type="text"
          placeholder="Search email or reason..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-64"
        />

        <select
          value={risk}
          onChange={(e) => setRisk(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="All">All Risks</option>
          <option value="Low Risk">Low Risk</option>
          <option value="Medium Risk">Medium Risk</option>
          <option value="High Risk">High Risk</option>
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Resolved">Resolved</option>
        </select>
      </div>

      {error && (
        <div className="text-red-600 font-medium">
          {error}
        </div>
      )}

      {/* 📋 TABLE */}
      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-2">Reported Email</th>
            <th className="border px-2 py-2">Reported By</th>
            <th className="border px-2 py-2">Risk</th>
            <th className="border px-2 py-2">Reason</th>
            <th className="border px-2 py-2">Date</th>
            <th className="border px-2 py-2">Action</th>
          </tr>
        </thead>

        <tbody>
          {reports.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="border px-2 py-4 text-center text-gray-500"
              >
                No scam reports found.
              </td>
            </tr>
          ) : (
            reports.map((r) => (
              <tr key={r._id}>
                <td className="border px-2 py-2">{r.reportedEmail}</td>
                <td className="border px-2 py-2">{r.reportedBy}</td>
                <td
                  className={`border px-2 py-2 font-semibold ${
                    r.riskLevel === "High Risk"
                      ? "text-red-600"
                      : r.riskLevel === "Medium Risk"
                      ? "text-yellow-600"
                      : "text-green-600"
                  }`}
                >
                  {r.riskLevel}
                </td>
                <td className="border px-2 py-2">{r.reason}</td>
                <td className="border px-2 py-2">
                  {new Date(r.createdAt).toLocaleString()}
                </td>
                <td className="border px-2 py-2">
                  {r.resolved ? (
                    <span className="text-green-600 font-bold">
                      Resolved
                    </span>
                  ) : (
                    <button
                      onClick={() => resolveReport(r._id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                    >
                      Resolve
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
