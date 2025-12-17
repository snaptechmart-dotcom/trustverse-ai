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
  const [error, setError] = useState("");

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/complaints");

      if (!res.ok) throw new Error("Failed to load complaints");

      const data = await res.json();
      setComplaints(data);
    } catch (err) {
      setError("Unable to load complaints");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (
    id: string,
    status: "resolved" | "rejected"
  ) => {
    try {
      setActionId(id);

      const res = await fetch("/api/admin/complaints", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });

      if (!res.ok) throw new Error("Update failed");

      await fetchComplaints();
    } catch (err) {
      alert("Action failed. Please try again.");
    } finally {
      setActionId(null);
    }
  };

  if (loading) return <p>Loading complaints...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
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
              <td className="p-2 border capitalize font-medium">
                {c.status}
              </td>
              <td className="p-2 border">
                {new Date(c.createdAt).toLocaleDateString()}
              </td>
              <td className="p-2 border space-x-2">
                {c.status === "pending" ? (
                  <>
                    <button
                      disabled={actionId === c._id}
                      onClick={() => updateStatus(c._id, "resolved")}
                      className="px-3 py-1 bg-green-600 text-white rounded disabled:opacity-50"
                    >
                      Resolve
                    </button>
                    <button
                      disabled={actionId === c._id}
                      onClick={() => updateStatus(c._id, "rejected")}
                      className="px-3 py-1 bg-red-600 text-white rounded disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  <span className="text-gray-500 font-semibold">Done</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
