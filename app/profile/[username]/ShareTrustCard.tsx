"use client";

import { useEffect, useState } from "react";

export default function ShareTrustCard({ username }: { username: string }) {
  const [profileUrl, setProfileUrl] = useState("");

  useEffect(() => {
    // ✅ Client side only — hydration safe
    const url = `${window.location.origin}/profile/${username}`;
    setProfileUrl(url);
  }, [username]);

  const copyToClipboard = async () => {
    if (!profileUrl) return;
    await navigator.clipboard.writeText(profileUrl);
    alert("Trust profile link copied!");
  };

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-2">Share Trust Profile</h3>
      <p className="text-sm text-gray-500 mb-4">
        Share this trusted profile with others
      </p>

      <div className="flex items-center justify-between gap-4 bg-gray-50 border rounded-lg px-4 py-3">
        {/* 👇 hydration-safe */}
        <span className="text-sm text-gray-800 truncate">
          {profileUrl || "Loading..."}
        </span>

        <button
          onClick={copyToClipboard}
          disabled={!profileUrl}
          className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
        >
          Copy
        </button>
      </div>
    </div>
  );
}
