"use client";

import { useState } from "react";

export default function ReportProfileButton({
  username,
}: {
  username: string;
}) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  async function submitReport() {
    if (!reason.trim()) {
      alert("Please enter a reason");
      return;
    }

    setLoading(true);

    await fetch("/api/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        reason,
      }),
    });

    setLoading(false);
    setReason("");
    setOpen(false);
    alert("Report submitted successfully");
  }

  return (
    <div className="rounded-2xl border bg-white p-6 space-y-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
      >
        🚩 Report Profile
      </button>

      {open && (
        <div className="space-y-3">
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Describe the issue…"
            className="w-full rounded-lg border p-3 text-sm"
            rows={3}
          />

          <button
            onClick={submitReport}
            disabled={loading}
            className="rounded-lg bg-black px-4 py-2 text-sm text-white hover:bg-gray-800"
          >
            {loading ? "Submitting..." : "Submit Report"}
          </button>
        </div>
      )}
    </div>
  );
}
