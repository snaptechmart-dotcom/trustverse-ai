"use client";

import { useSession } from "next-auth/react";

export default function DashboardSettingsPage() {
  // ✅ SAFE PATTERN (BUILD + RUNTIME SAFE)
  const sessionHook = useSession();
  const session = sessionHook?.data;
  const status = sessionHook?.status;

  // ✅ BUILD / PRERENDER SAFE GUARDS
  if (status === "loading" || !status) {
    return <p className="p-4">Loading profile...</p>;
  }

  if (!session) {
    return <p className="p-4">Unauthorized</p>;
  }

  return (
    <div className="bg-white rounded-xl shadow p-6 space-y-4 max-w-xl">
      <h2 className="text-lg font-semibold text-gray-800">
        My Profile
      </h2>

      <div className="text-sm text-gray-700 space-y-1">
        <p>
          <span className="font-medium">Name:</span>{" "}
          {session.user?.name || "Not set"}
        </p>

        <p>
          <span className="font-medium">Email:</span>{" "}
          {session.user?.email}
        </p>

        <p>
          <span className="font-medium">Role:</span>{" "}
          {(session.user as any)?.role || "User"}
        </p>
      </div>

      <p className="text-xs text-gray-400">
        Profile editing coming soon
      </p>
    </div>
  );
}
