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
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchComplaints = async () => {
    try {
      const res = await fetch("/api/admin/complaints", { cache: "no-store" });
      const data = await res.json();
      setComplaints(data);
    } catch (err) {
      console.error("Failed to load complaints");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const updateStatus = async (
    id: string,
    status: "resolved" | "rejected" | "pending"
  ) => {
    setActionLoading(id);

    await fetch("/api/admin/complaints", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });

    await fetchComplaints();
    setActionLoading(null);
  };

  if (loading) return <p>Loading complaints...</p>;
  if (complaints.length === 0) return <p>No complaints found.</p>;

  return (
    <div className="mt-6 overflow-x-auto">
      <table className="w-full border rounded-lg text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Profile</th>
            <th className="p-2 border">Reported By</th>
            <th className="p-2 border">Reason</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Date</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>

        <tbody>
          {complaints.map((c) => (
            <tr key={c._id} className="text-center">
              <td className="p-2 border">{c.profileUsername}</td>
              <td className="p-2 border">{c.reportedBy}</td>
              <td className="p-2 border">{c.reason}</td>
              <td className="p-2 border capitalize">{c.status}</td>
              <td className="p-2 border">
                {new Date(c.createdAt).toLocaleDateString()}
              </td>

              <td className="p-2 border space-x-2">
                {c.status === "pending" && (
                  <>
                    <button
                      disabled={actionLoading === c._id}
                      onClick={() => updateStatus(c._id, "resolved")}
                      className="px-2 py-1 bg-green-600 text-white rounded"
                    >
                      Resolve
                    </button>
                    <button
                      disabled={actionLoading === c._id}
                      onClick={() => updateStatus(c._id, "rejected")}
                      className="px-2 py-1 bg-red-600 text-white rounded"
                    >
                      Reject
                    </button>
                  </>
                )}

                {c.status !== "pending" && (
                  <button
                    disabled={actionLoading === c._id}
                    onClick={() => updateStatus(c._id, "pending")}
                    className="px-2 py-1 bg-yellow-500 text-white rounded"
                  >
                    Reopen
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
