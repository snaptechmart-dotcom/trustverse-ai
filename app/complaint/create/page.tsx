"use client";

import { useState } from "react";

export default function ComplaintCreatePage() {
  const [againstUsername, setAgainstUsername] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      againstUsername,
      email,
      category,
      description,
    };

    console.log("📤 Sending payload:", payload);

    try {
      const res = await fetch("/api/complaint/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("📥 Response:", data);

      if (!res.ok) {
        alert(data.error || "Complaint failed");
        setLoading(false);
        return;
      }

      alert("✅ Complaint submitted successfully");

      // Reset form
      setAgainstUsername("");
      setEmail("");
      setCategory("");
      setDescription("");
    } catch (err) {
      console.error("❌ Submit error:", err);
      alert("Server error");
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 600 }}>
      <h1 style={{ fontSize: 26, marginBottom: 20 }}>
        Submit a Complaint
      </h1>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Against Username</label>
          <input
            type="text"
            value={againstUsername}
            onChange={(e) => setAgainstUsername(e.target.value)}
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Your Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            style={{ width: "100%", padding: 8 }}
          >
            <option value="">Select category</option>
            <option value="Fake Service">Fake Service</option>
            <option value="Fraud">Fraud</option>
            <option value="Misleading Info">Misleading Info</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px 20px",
            cursor: "pointer",
          }}
        >
          {loading ? "Submitting..." : "Submit Complaint"}
        </button>
      </form>
    </div>
  );
}
