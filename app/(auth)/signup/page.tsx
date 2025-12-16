"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setLoading(true);

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    setLoading(false);

    if (!res.ok) {
      alert("Signup failed");
      return;
    }

    alert("Account created successfully");
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#061826] via-[#0b2a3c] to-[#0f3d4c]">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
        <h1 className="text-2xl font-bold text-white text-center mb-6">
          Create Account
        </h1>

        <input
          type="email"
          placeholder="Email address"
          className="w-full mb-4 px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full py-3 rounded-lg bg-gradient-to-r from-green-400 to-emerald-500 text-black font-semibold hover:opacity-90 transition"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        <p className="text-center text-white/80 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-cyan-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
