"use client";

import { useEffect, useState } from "react";

type Complaint = {
  _id: string;
  profileUsername: string;
  reportedBy: string;
  reason: string;
  status: "pending" | "resolved" | "rejected";
  createdAt: string;
};

export default function ComplaintsTable() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  const fetchComplaints = async () => {
    const res = await fetch("/api/admin/complaints", { cache: "no-store" });
    const data = await res.json();
    setComplaints(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const updateStatus = async (
    id: string,
    status: "resolved" | "rejected"
  ) => {
    setActionId(id);

    await fetch("/api/admin/complaints/action", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });

    await fetchComplaints();
    setActionId(null);
  };

  if (loading) return <p>Loading complaints...</p>;
  if (complaints.length === 0) return <p>No complaints found.</p>;

  return (
    <div className="mt-6 overflow-x-auto">
      <table className="w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Profile</th>
            <th className="border p-2">Reported By</th>
            <th className="border p-2">Reason</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map((c) => (
            <tr key={c._id} className="text-center">
              <td className="border p-2">{c.profileUsername}</td>
              <td className="border p-2">{c.reportedBy}</td>
              <td className="border p-2">{c.reason}</td>
              <td className="border p-2 capitalize">{c.status}</td>
              <td className="border p-2">
                {new Date(c.createdAt).toLocaleDateString()}
              </td>
              <td className="border p-2 space-x-2">
                {c.status === "pending" ? (
                  <>
                    <button
                      disabled={actionId === c._id}
                      onClick={() => updateStatus(c._id, "resolved")}
                      className="px-3 py-1 bg-green-600 text-white rounded"
                    >
                      Resolve
                    </button>
                    <button
                      disabled={actionId === c._id}
                      onClick={() => updateStatus(c._id, "rejected")}
                      className="px-3 py-1 bg-red-600 text-white rounded"
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  <span className="text-gray-500">Done</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
