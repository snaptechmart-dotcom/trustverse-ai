"use client";

import { useEffect, useState } from "react";

type Complaint = {
  _id: string;
  profileUsername: string;
  reason: string;
  status: string;
  createdAt: string;
};

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  // 🔹 Fetch complaints
  const fetchComplaints = async () => {
    const res = await fetch("/api/admin/complaints");
    const data = await res.json();
    setComplaints(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  // 🔹 Resolve complaint action
  const resolveComplaint = async (complaintId: string) => {
    const confirmAction = confirm(
      "Are you sure you want to mark this complaint as resolved?"
    );
    if (!confirmAction) return;

    setResolvingId(complaintId);

    try {
      const res = await fetch("/api/admin/complaints/resolve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ complaintId }),
      });

      const data = await res.json();

      if (data.success) {
        await fetchComplaints(); // refresh table
        alert("Complaint resolved successfully");
      } else {
        alert(data.error || "Failed to resolve complaint");
      }
    } catch (err) {
      alert("Something went wrong");
    } finally {
      setResolvingId(null);
    }
  };

  if (loading) return <p>Loading complaints...</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Complaints</h2>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Profile</th>
              <th className="p-3 text-left">Reason</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((c) => (
              <tr key={c._id} className="border-t">
                <td className="p-3">{c.profileUsername}</td>
                <td className="p-3">{c.reason}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      c.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {c.status}
                  </span>
                </td>
                <td className="p-3">
                  {new Date(c.createdAt).toLocaleDateString()}
                </td>
                <td className="p-3">
                  {c.status === "pending" ? (
                    <button
                      onClick={() => resolveComplaint(c._id)}
                      disabled={resolvingId === c._id}
                      className="text-blue-600 hover:underline disabled:opacity-50"
                    >
                      {resolvingId === c._id
                        ? "Resolving..."
                        : "Mark Resolved"}
                    </button>
                  ) : (
                    <span className="text-gray-400 text-xs">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
