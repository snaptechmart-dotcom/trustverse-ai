"use client";

import { useEffect, useState } from "react";

type Complaint = {
  _id: string;
  profileUsername: string;
  reportedBy: string;
  reason: string;
  status: "pending" | "resolved";
  createdAt: string;
};

export default function ComplaintsTable() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await fetch("/api/admin/complaints");
      const data = await res.json();
      setComplaints(data);
    } catch (error) {
      console.error("Failed to load complaints", error);
    } finally {
      setLoading(false);
    }
  };

  const resolveComplaint = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/complaints/resolve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        // UI update without reload
        setComplaints((prev) =>
          prev.map((c) =>
            c._id === id ? { ...c, status: "resolved" } : c
          )
        );
      }
    } catch (error) {
      console.error("Resolve failed", error);
    }
  };

  if (loading) return <p>Loading complaints...</p>;

  if (complaints.length === 0) {
    return <p>No complaints found.</p>;
  }

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Admin – Complaints</h2>

      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Profile</th>
            <th className="border p-2">Reported By</th>
            <th className="border p-2">Reason</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>

        <tbody>
          {complaints.map((c) => (
            <tr key={c._id}>
              <td className="border p-2">{c.profileUsername}</td>
              <td className="border p-2">{c.reportedBy}</td>
              <td className="border p-2">{c.reason}</td>
              <td className="border p-2 capitalize">{c.status}</td>
              <td className="border p-2">
                {c.status === "resolved" ? (
                  <button
                    disabled
                    className="bg-green-500 text-white px-3 py-1 rounded opacity-70 cursor-not-allowed"
                  >
                    Resolved
                  </button>
                ) : (
                  <button
                    onClick={() => resolveComplaint(c._id)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Resolve
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
