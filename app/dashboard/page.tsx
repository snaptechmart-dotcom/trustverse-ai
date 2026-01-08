"use client";

import { useEffect, useState } from "react";

type Stats = {
  totalReports: number;
  trustScoreChecks: number;
  phoneVerifications: number;
};

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalReports: 0,
    trustScoreChecks: 0,
    phoneVerifications: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/dashboard-stats", {
          credentials: "include",
        });

        if (!res.ok) return;

        const data = await res.json();

        setStats({
          totalReports: data.totalReports ?? 0,
          trustScoreChecks: data.trustScoreChecks ?? 0,
          phoneVerifications: data.phoneVerifications ?? 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">
        Dashboard Overview
      </h1>

      {loading ? (
        <p className="text-gray-500">Loading stats…</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border rounded-xl p-6">
            <p className="text-gray-500">Total Reports</p>
            <p className="text-3xl font-bold text-red-600">
              {stats.totalReports}
            </p>
          </div>

          <div className="bg-white border rounded-xl p-6">
            <p className="text-gray-500">Trust Score Checks</p>
            <p className="text-3xl font-bold text-emerald-600">
              {stats.trustScoreChecks}
            </p>
          </div>

          <div className="bg-white border rounded-xl p-6">
            <p className="text-gray-500">Phone Verifications</p>
            <p className="text-3xl font-bold text-blue-600">
              {stats.phoneVerifications}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
