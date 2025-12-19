"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const [credits, setCredits] = useState<number | null>(null);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/credits")
        .then((res) => res.json())
        .then((data) => setCredits(data.credits ?? 0))
        .catch(() => setCredits(0));
    }
  }, [status]);

  if (status === "loading") {
    return <p className="p-6">Loading settings...</p>;
  }

  if (!session) {
    return <p className="p-6">Unauthorized</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold">Settings</h1>

      {/* Profile Info */}
      <div className="border rounded-lg p-4 space-y-2">
        <h2 className="text-lg font-semibold">Profile Information</h2>

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

        <p>
          <span className="font-medium">Credits:</span>{" "}
          {credits !== null ? credits : "Loading..."}
        </p>
      </div>

      {/* Security (Future) */}
      <div className="border rounded-lg p-4 opacity-60">
        <h2 className="text-lg font-semibold">Security</h2>
        <p className="text-sm text-gray-500">
          Password change coming soon.
        </p>
      </div>

      {/* Danger Zone */}
      <div className="border border-red-300 rounded-lg p-4 space-y-3">
        <h2 className="text-lg font-semibold text-red-600">Danger Zone</h2>

        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
