"use client";

import { useEffect, useState } from "react";

export default function ShareTrustCard({ username }: { username: string }) {
  const [profileUrl, setProfileUrl] = useState("");

  useEffect(() => {
    // ✅ Runs only on client → hydration safe
    const url = `${window.location.origin}/profile/${username}`;
    setProfileUrl(url);
  }, [username]);

  const copyLink = async () => {
    await navigator.clipboard.writeText(profileUrl);
    alert("Trust profile link copied!");
  };

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Share Trust Profile</h3>

      <div className="flex items-center justify-between gap-4 bg-gray-50 border rounded-lg px-4 py-3">
        <span className="text-sm text-gray-800 truncate">
          {profileUrl || "Loading profile link..."}
        </span>

        <button
          onClick={copyLink}
          disabled={!profileUrl}
          className="rounded-md bg-black px-4 py-2 text-sm text-white hover:bg-gray-800 disabled:opacity-50"
        >
          Copy
        </button>
      </div>
    </div>
  );
}
