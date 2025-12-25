"use client";

import Link from "next/link";

export default function AIToolsPage() {
  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          AI Tools
        </h1>
        <p className="text-gray-500 mt-1">
          Access all Trustverse AI-powered tools from one place
        </p>
      </div>

      {/* TOOLS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* TRUST SCORE TOOL */}
        <div className="bg-white rounded-xl shadow-sm border p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Trust Score Analyzer
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Analyze people or profiles using AI-powered trust scoring.
            </p>
          </div>

          <Link
            href="/dashboard/trust-score"
            className="mt-4 inline-block text-sm font-medium text-indigo-600 hover:underline"
          >
            Open Tool →
          </Link>
        </div>

        {/* PHONE VERIFICATION TOOL */}
        <div className="bg-white rounded-xl shadow-sm border p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Phone Verification
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Verify phone numbers to detect spam, fraud, or risk signals.
            </p>
          </div>

          <Link
            href="/dashboard/phone-check"
            className="mt-4 inline-block text-sm font-medium text-indigo-600 hover:underline"
          >
            Open Tool →
          </Link>
        </div>

        {/* PROFILE HISTORY TOOL */}
        <div className="bg-white rounded-xl shadow-sm border p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Profile History
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              View past checks, reports, and activity history.
            </p>
          </div>

          <Link
            href="/dashboard/history"
            className="mt-4 inline-block text-sm font-medium text-indigo-600 hover:underline"
          >
            View History →
          </Link>
        </div>

      </div>
    </div>
  );
}
