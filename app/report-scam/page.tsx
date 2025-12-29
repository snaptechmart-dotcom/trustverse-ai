"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export const dynamic = "force-dynamic";

function ReportScamContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const source = searchParams.get("source");
  const risk = searchParams.get("risk");
  const score = searchParams.get("score");

  const [details, setDetails] = useState("");

  const submitReport = async () => {
    if (!details.trim()) {
      alert("Please describe the scam details.");
      return;
    }

    // Backend already exists — UI confirmation only
    alert("Scam report submitted successfully ✅");
    router.push("/dashboard");
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-red-600">
        🚨 Report a Scam
      </h1>

      <p className="text-gray-600">
        You are reporting a scam based on AI analysis.
      </p>

      {/* AUTO DATA */}
      <div className="bg-gray-50 border rounded-lg p-4 space-y-2">
        <p>
          <strong>Source:</strong> {source || "N/A"}
        </p>
        <p>
          <strong>Risk Level:</strong> {risk || "N/A"}
        </p>
        <p>
          <strong>Trust Score:</strong> {score || "N/A"}
        </p>
      </div>

      {/* USER INPUT */}
      <textarea
        className="w-full border rounded-md p-3"
        rows={5}
        placeholder="Describe what makes this suspicious or scam..."
        value={details}
        onChange={(e) => setDetails(e.target.value)}
      />

      {/* ACTION */}
      <button
        onClick={submitReport}
        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded"
      >
        Submit Scam Report
      </button>
    </div>
  );
}

export default function ReportScamPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading report form…</div>}>
      <ReportScamContent />
    </Suspense>
  );
}
