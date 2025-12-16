"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function DashboardProfilePage() {
  // 🔹 ALL HOOKS AT TOP (RULES OF HOOKS)
  const { data: session, status } = useSession();
  const router = useRouter();

  const [form, setForm] = useState({
    username: "",
    displayName: "",
    category: "",
    location: "",
    bio: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 🔐 Auth guard
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // ⏳ Loading state
  if (status === "loading") {
    return <div className="p-6">Loading...</div>;
  }

  if (!session) {
    return null;
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const saveProfile = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error("Failed to save profile");
      }

      setMessage("✅ Profile saved successfully");
    } catch (error) {
      console.error(error);
      setMessage("❌ Error saving profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-5">
      <h1 className="text-2xl font-bold">Trust Profile</h1>

      <input
        name="username"
        placeholder="Username (unique)"
        className="w-full border rounded p-2"
        value={form.username}
        onChange={handleChange}
      />

      <input
        name="displayName"
        placeholder="Display Name / Business Name"
        className="w-full border rounded p-2"
        value={form.displayName}
        onChange={handleChange}
      />

      <input
        name="category"
        placeholder="Category (Service, Freelancer, Company)"
        className="w-full border rounded p-2"
        value={form.category}
        onChange={handleChange}
      />

      <input
        name="location"
        placeholder="Location (City, Country)"
        className="w-full border rounded p-2"
        value={form.location}
        onChange={handleChange}
      />

      <textarea
        name="bio"
        placeholder="Short bio (max 500 characters)"
        className="w-full border rounded p-2"
        rows={4}
        value={form.bio}
        onChange={handleChange}
      />

      <button
        onClick={saveProfile}
        disabled={loading}
        className="bg-black text-white px-6 py-2 rounded"
      >
        {loading ? "Saving..." : "Save Profile"}
      </button>

      {message && <p className="text-sm">{message}</p>}
    </div>
  );
}
