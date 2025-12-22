"use client";

import { useEffect, useState } from "react";

type Complaint = {
  _id: string;
  againstUsername: string;
  category: string;
  status: string;
  createdAt: string;
};

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  const loadComplaints = async () => {
    try {
      const res = await fetch(
        "/api/admin/complaints",
        { cache: "no-store" }
      );
      const data = await res.json();
      setComplaints(data.complaints || []);
    } catch (err) {
      console.error("Load complaints error:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  const handleAction = async (
    id: string,
    action: "resolve" | "reject"
  ) => {
    const confirm = window.confirm(
      `Are you sure you want to ${action} this complaint?`
    );
    if (!confirm) return;

    try {
      const res = await fetch(
        "/api/admin/complaints/update",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            complaintId: id,
            action,
          }),
        }
      );

      const data = await res.json();
      alert(data.message || "Done");
      loadComplaints();
    } catch (err) {
      console.error("Action error:", err);
    }
  };

  if (loading) return <p>Loading complaints...</p>;

  return (
    <div>
      <h1 style={{ fontSize: 26, marginBottom: 20 }}>
        Admin – Complaints
      </h1>

      {complaints.length === 0 ? (
        <p>No complaints found.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr>
              <th style={th}>Username</th>
              <th style={th}>Category</th>
              <th style={th}>Status</th>
              <th style={th}>Date</th>
              <th style={th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((c) => (
              <tr key={c._id}>
                <td style={td}>{c.againstUsername}</td>
                <td style={td}>{c.category}</td>
                <td style={td}>{c.status}</td>
                <td style={td}>
                  {new Date(c.createdAt).toLocaleString()}
                </td>
                <td style={td}>
                  {c.status === "pending" ? (
                    <>
                      <button
                        onClick={() =>
                          handleAction(c._id, "resolve")
                        }
                      >
                        Resolve
                      </button>{" "}
                      <button
                        onClick={() =>
                          handleAction(c._id, "reject")
                        }
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <b>{c.status}</b>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const th = {
  border: "1px solid #ccc",
  padding: 8,
  background: "#f5f5f5",
};

const td = {
  border: "1px solid #ccc",
  padding: 8,
};
