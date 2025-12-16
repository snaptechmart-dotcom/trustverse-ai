"use client";

import { useState } from "react";

export default function ReportButton({ username }: { username: string }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!reason) return alert("Please enter reason");

    setLoading(true);

    await fetch("/api/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, reason }),
    });

    setLoading(false);
    setOpen(false);
    alert("Report submitted");
  };

  return (
    <div className="text-center">
      <button
        onClick={() => setOpen(true)}
        className="border px-4 py-2 rounded text-red-600"
      >
        🚩 Report Profile
      </button>

      {open && (
        <div className="mt-4 space-y-2">
          <textarea
            className="w-full border p-2"
            placeholder="Reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <button
            onClick={submit}
            disabled={loading}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      )}
    </div>
  );
}
