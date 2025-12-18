"use client";

import { useEffect, useState } from "react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/users/list")
      .then(res => res.json())
      .then(data => {
        setUsers(data.users || []);
        setLoading(false);
      });
  }, []);

  async function updateCredits(userId: string, credits: number) {
    await fetch("/api/admin/users/credits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, credits }),
    });
    alert("Credits updated");
  }

  if (loading) return <p>Loading users...</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Admin – User Manager</h1>

      <div className="space-y-4">
        {users.map(user => (
          <div
            key={user._id}
            className="border p-4 rounded flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{user.email}</p>
              <p className="text-sm text-gray-500">
                Plan: {user.plan} | Credits: {user.credits}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => updateCredits(user._id, user.credits + 10)}
                className="px-3 py-1 bg-green-600 text-white rounded"
              >
                +10
              </button>

              <button
                onClick={() => updateCredits(user._id, 0)}
                className="px-3 py-1 bg-red-600 text-white rounded"
              >
                Block
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
