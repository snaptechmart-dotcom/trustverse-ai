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
  const [error, setError] = useState<string | null>(null);

  const fetchComplaints = async () => {
    try {
      const res = await fetch("/api/admin/complaints");

      if (!res.ok) {
        throw new Error("API error");
      }

      const data = await res.json();
      setComplaints(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load complaints");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
