"use client";

import { useState } from "react";

export default function AdminTrustPage() {
  const [username, setUsername] = useState("");
  const [verified, setVerified] = useState(false);
  const [adminScore, setAdminScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const submitTrustUpdate = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/admin/trust", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          verified,
          adminScore,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update trust");
      }

      setMessage("✅ Trust profile updated successfully");
    } catch (err: any) {
      setMessage("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-5">
      <h1 className="text-2xl font-bold">Admin Trust Panel</h1>

      <input
        type="text"
        placeholder="Username (e.g. test)"
        className="w-full border rounded p-2"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={verified}
          onChange={(e) => setVerified(e.target.checked)}
        />
        <span>Verified Profile</span>
      </label>

      <div>
        <label className="block mb-1">
          Admin Trust Score: <b>{adminScore}</b> / 30
        </label>
        <input
          type="range"
          min={0}
          max={30}
          value={adminScore}
          onChange={(e) => setAdminScore(Number(e.target.value))}
          className="w-full"
        />
      </div>

      <button
        onClick={submitTrustUpdate}
        disabled={loading}
        className="bg-black text-white px-6 py-2 rounded"
      >
        {loading ? "Updating..." : "Update Trust"}
      </button>

      {message && <p className="text-sm">{message}</p>}
    </div>
  );
}
