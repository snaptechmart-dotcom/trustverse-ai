"use client";
export const dynamic = "force-dynamic";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const sessionData = useSession();
  const session = sessionData?.data;
  const status = sessionData?.status;

  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Load user data from API
  useEffect(() => {
    const loadUser = async () => {
      if (!session?.user) return;

      const res = await fetch("/api/user/me");
      const data = await res.json();
      setUser(data);
    };

    loadUser();
  }, [session]);

  if (status === "loading" || !user) {
    return <p className="text-white p-10">Loading...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">
        Welcome, {user.name || "User"}
      </h1>

      {/* PLAN CARD */}
      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 mb-8">
        <h2 className="text-xl font-bold">Your Plan</h2>
        <p className="text-3xl font-extrabold mt-2 capitalize">
          {user.plan}
        </p>

        {user.planValidTill && (
          <p className="text-gray-300 mt-1">
            Valid till: <b>{new Date(user.planValidTill).toDateString()}</b>
          </p>
        )}
      </div>

      {/* USAGE CARD */}
      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 mb-8">
        <h2 className="text-xl font-bold mb-3">Usage</h2>
        <p className="text-lg">
          <b>Trust Checks Used:</b> {user.trustChecksUsed}
        </p>
        <p className="text-lg mt-2">
          <b>Reports Used:</b> {user.reportsUsed}
        </p>
      </div>

      {/* LOGOUT BUTTON */}
      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="mt-6 w-full py-3 bg-red-600 rounded-lg hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
}
