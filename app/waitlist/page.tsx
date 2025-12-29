"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function WaitlistPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const router = useRouter();

  const handleSubmit = async () => {
    if (!email.trim()) {
      alert("Please enter a valid email");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        alert("Something went wrong");
        return;
      }

      setSuccess(true);
      setEmail("");

      // 🚀 AUTO REDIRECT TO DASHBOARD (KEY PART)
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (err) {
      alert("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md text-center space-y-5">
        <h1 className="text-2xl font-bold text-gray-900">
          Join the Pre-Launch Waitlist
        </h1>

        <p className="text-gray-600">
          Get early access to Trustverse AI before anyone else.
        </p>

        {!success ? (
          <>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-md"
            >
              {loading ? "Joining..." : "Join Waitlist"}
            </button>
          </>
        ) : (
          <p className="text-emerald-600 font-medium">
            🎉 You’re added! Redirecting to dashboard...
          </p>
        )}
      </div>
    </div>
  );
}
