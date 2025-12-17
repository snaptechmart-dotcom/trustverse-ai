"use client";

import { useEffect, useState } from "react";

type Complaint = {
  _id: string;
  profileUsername?: string;
  reason?: string;
  action?: string;
};

export default function ComplaintsTable() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await fetch("/api/admin/complaints");

        if (!res.ok) {
          throw new Error("Failed to fetch complaints");
        }

        const data = await res.json();

        // 🛡️ Safety check
        if (Array.isArray(data)) {
          setComplaints(data);
        } else {
          setComplaints([]);
        }
      } catch (err: any) {
        console.error("Complaints fetch error:", err);
        setError("Unable to load complaints");
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  if (loading) {
    return <p>Loading complaints...</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  if (complaints.length === 0) {
    return <p>No complaints found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Username</th>
            <th className="border p-2">Reason</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map((c) => (
            <tr key={c._id}>
              <td className="border p-2">
                {c.profileUsername || "N/A"}
              </td>
              <td className="border p-2">
                {c.reason || "N/A"}
              </td>
              <td className="border p-2">
                {c.action || "Pending"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
