"use client";

import { useState } from "react";

export default function WaitlistPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (data.ok) {
        setMessage("🎉 You’re added to the waitlist!");
        setEmail("");
      } else {
        setMessage("❌ Invalid or duplicate email.");
      }
    } catch (err) {
      setMessage("⚠️ Server error. Try again.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#081b33] flex items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-xl max-w-md w-full p-8 text-center">

        <h1 className="text-3xl font-bold text-[#081b33] mb-3">
          Join the Pre-Launch Waitlist
        </h1>

        <p className="text-gray-600 mb-6">
          Get early access to Trustverse AI before anyone else.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            required
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#081b33] outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#081b33] text-white rounded-lg font-semibold hover:bg-[#0a2647]"
          >
            {loading ? "Adding..." : "Join Waitlist"}
          </button>
        </form>

        {message && (
          <p className="mt-4 font-semibold text-[#081b33]">{message}</p>
        )}
      </div>
    </div>
  );
}
