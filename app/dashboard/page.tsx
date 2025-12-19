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

        // ✅ MATCH API RESPONSE KEYS
        setTotalReports(data.totalReports ?? 0);
        setTrustScoreChecks(data.trustChecks ?? 0);
        setPhoneVerifications(data.phoneChecks ?? 0);
      } catch (error) {
        console.error("Failed to load dashboard stats", error);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="p-10 text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 space-y-6">
      <h1 className="text-2xl font-bold">
        Welcome to Your Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* TOTAL REPORTS */}
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <p className="text-gray-500 text-sm">Total Reports</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {totalReports}
          </p>
        </div>

        {/* TRUST SCORE CHECKS */}
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <p className="text-gray-500 text-sm">
            Trust Score Checks
          </p>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {trustScoreChecks}
          </p>
        </div>

        {/* PHONE VERIFICATIONS */}
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <p className="text-gray-500 text-sm">
            Phone Verifications
          </p>
          <p className="text-3xl font-bold text-purple-600 mt-2">
            {phoneVerifications}
          </p>
        </div>
      </div>
    </div>
  );
}
