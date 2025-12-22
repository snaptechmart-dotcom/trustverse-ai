"use client";

import { useSession } from "next-auth/react";

export default function ProfileClient() {
  const sessionHook = useSession();
  const session = sessionHook?.data;
  const status = sessionHook?.status;

  if (status === "loading" || !status) {
    return <p className="p-4">Loading profile...</p>;
  }

  if (!session) {
    return <p className="p-4">Unauthorized</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6 space-y-6">
      <h1 className="text-2xl font-bold">My Profile</h1>

      <div className="border rounded-lg p-4 bg-white space-y-2">
        <p className="text-sm text-gray-700">
          <span className="font-medium">Name:</span>{" "}
          {session.user?.name || "Not set"}
        </p>

        <p className="text-sm text-gray-700 break-words">
          <span className="font-medium">Email:</span>{" "}
          {session.user?.email}
        </p>

        <p className="text-sm text-gray-700">
          <span className="font-medium">Role:</span>{" "}
          {(session.user as any)?.role || "User"}
        </p>
      </div>
    </div>
  );
}
