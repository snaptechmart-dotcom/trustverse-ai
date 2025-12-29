"use client";

import { useEffect, useState } from "react";

type Stats = {
  totalReports: number;
  trustChecks: number;
  phoneChecks: number;
};

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalReports: 0,
    trustChecks: 0,
    phoneChecks: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/dashboard/stats");

        if (!res.ok) {
          console.error("Dashboard stats API failed");
          return;
        }

        const data = await res.json();

        // 🔥 IMPORTANT: exact keys from API
        setStats({
          totalReports: data.totalReports ?? 0,
          trustChecks: data.trustChecks ?? 0,
          phoneChecks: data.phoneChecks ?? 0,
        });
      } catch (error) {
        console.error("Failed to load dashboard stats", error);
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
          {/* TOTAL REPORTS */}
          <div className="bg-white border rounded-xl p-6">
            <p className="text-gray-500">Total Reports</p>
            <p className="text-3xl font-bold text-red-600">
              {stats.totalReports}
            </p>
          </div>

          {/* TRUST CHECKS */}
          <div className="bg-white border rounded-xl p-6">
            <p className="text-gray-500">Trust Score Checks</p>
            <p className="text-3xl font-bold text-emerald-600">
              {stats.trustChecks}
            </p>
          </div>

          {/* PHONE CHECKS */}
          <div className="bg-white border rounded-xl p-6">
            <p className="text-gray-500">Phone Verifications</p>
            <p className="text-3xl font-bold text-blue-600">
              {stats.phoneChecks}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
