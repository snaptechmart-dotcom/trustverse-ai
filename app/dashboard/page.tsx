"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);

  const [totalReports, setTotalReports] = useState(0);
  const [trustScoreChecks, setTrustScoreChecks] = useState(0);
  const [phoneVerifications, setPhoneVerifications] = useState(0);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch("/api/dashboard-stats");
        const data = await res.json();

        setTotalReports(data.totalReports ?? 0);
        setTrustScoreChecks(data.trustChecks ?? 0);
        setPhoneVerifications(data.phoneChecks ?? 0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Dashboard Overview
        </h1>
        <p className="text-gray-500 mt-1">
          Track your activity and trust checks at a glance
        </p>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <p className="text-sm text-gray-500">Total Reports</p>
          <p className="mt-2 text-4xl font-bold text-blue-600">
            {totalReports}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <p className="text-sm text-gray-500">Trust Score Checks</p>
          <p className="mt-2 text-4xl font-bold text-green-600">
            {trustScoreChecks}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <p className="text-sm text-gray-500">Phone Verifications</p>
          <p className="mt-2 text-4xl font-bold text-purple-600">
            {phoneVerifications}
          </p>
        </div>
      </div>
    </div>
  );
}
