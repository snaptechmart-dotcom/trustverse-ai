"use client";

import { useEffect, useState } from "react";

type Complaint = {
  _id: string;
  profileUsername: string;
  reportedBy: string;
  reason: string;
  status: string;
  createdAt: string;
};

export default function ComplaintsTable() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch complaints
  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/complaints");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setComplaints(data);
    } catch (err) {
      setError("Unable to load complaints");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  // Resolve complaint
  const resolveComplaint = async (id: string) => {
    try {
      const res = await fetch("/api/admin/complaints/resolve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error("Resolve failed");

      // refresh list
      fetchComplaints();
    } catch (err) {
      alert("Failed to resolve complaint");
    }
  };

  if (loading) return <p>Loading complaints...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-3 py-2">Profile</th>
            <th className="border px-3 py-2">Reported By</th>
            <th className="border px-3 py-2">Reason</th>
            <th className="border px-3 py-2">Status</th>
            <th className="border px-3 py-2">Date</th>
            <th className="border px-3 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map((c) => (
            <tr key={c._id}>
              <td className="border px-3 py-2">{c.profileUsername}</td>
              <td className="border px-3 py-2">{c.reportedBy}</td>
              <td className="border px-3 py-2">{c.reason}</td>
              <td className="border px-3 py-2 capitalize">
                {c.status}
              </td>
              <td className="border px-3 py-2">
                {new Date(c.createdAt).toLocaleDateString()}
              </td>
              <td className="border px-3 py-2">
                {c.status !== "resolved" ? (
                  <button
                    onClick={() => resolveComplaint(c._id)}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    Resolve
                  </button>
                ) : (
                  <span className="text-green-700 font-semibold">
                    Resolved
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
