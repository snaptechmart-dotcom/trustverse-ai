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

  useEffect(() => {
    let isMounted = true;

    async function loadComplaints() {
      try {
        const res = await fetch("/api/admin/complaints", {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Fetch failed");
        }

        const data = await res.json();

        if (isMounted && Array.isArray(data)) {
          setComplaints(data);
        }
      } catch (err) {
        console.error("CLIENT FETCH ERROR:", err);
        if (isMounted) {
          setComplaints([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadComplaints();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) return <p>Loading complaints…</p>;

  if (!complaints || complaints.length === 0) {
    return <p>No complaints found.</p>;
  }

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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
