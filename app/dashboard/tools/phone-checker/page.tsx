"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CreditWarningBanner from "@/components/CreditWarningBanner";

type ResultType = {
  phone: string;
  trustScore: number;
  riskLevel: "Low Risk" | "Medium Risk" | "High Risk";
  analysis: {
    summary: string;
    signals: string[];
    recommendation: string;
  };
  remainingCredits: number | "unlimited";
};

export default function PhoneCheckerPage() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResultType | null>(null);
  const [credits, setCredits] = useState<number | "unlimited">(0);

  const router = useRouter();

  /* 🔥 FETCH CREDITS */
  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const res = await fetch("/api/credits", {
          credentials: "include",
        });
        if (!res.ok) return;

        const data = await res.json();
        setCredits(data.credits ?? 0);
      } catch {
        // silent
      }
    };

    fetchCredits();

    const listener = () => fetchCredits();
    window.addEventListener("credits-updated", listener);

    return () => {
      window.removeEventListener("credits-updated", listener);
    };
  }, []);

  const handleCheck = async () => {
    if (!phone.trim()) {
      alert("Please enter a phone number with country code.");
      return;
    }

    if (credits !== "unlimited" && credits <= 0) {
      alert("No credits left. Please upgrade to Pro.");
      router.push("/pricing");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/phone-check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ phone }),
      });

      if (res.status === 401) {
        alert("Session expired. Please login again.");
        router.push("/login");
        return;
      }

      if (res.status === 402) {
        alert("No credits left. Please upgrade to Pro.");
        router.push("/pricing");
        return;
      }

      if (!res.ok) {
        alert("Service temporarily unavailable. Please try again.");
        return;
      }

      const data: ResultType = await res.json();
      setResult(data);
      setPhone("");

      window.dispatchEvent(new Event("credits-updated"));
    } catch {
      alert("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 max-w-4xl">
      {/* CREDIT WARNING (FREE ONLY) */}
      {credits !== "unlimited" && <CreditWarningBanner />}

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Phone Number Checker
        </h1>
        <p className="text-gray-500 mt-2 max-w-3xl">
          Verify phone numbers to detect spam, fraud, or risky activity using
          advanced AI-powered trust signals.
        </p>
      </div>

      {/* INPUT */}
      <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4 max-w-xl">
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter phone number with country code (e.g. +91...)"
          className="w-full bg-slate-50 border border-slate-300 rounded-md px-4 py-2
          focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />

        <button
          onClick={handleCheck}
          disabled={loading}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-md
          transition disabled:opacity-60"
        >
          {loading ? "Checking..." : "Check Number"}
        </button>
      </div>

      {/* RESULT */}
      {result && (
        <div className="bg-white border rounded-xl p-6 max-w-2xl space-y-5">
          <h3 className="text-xl font-semibold text-gray-900">
            🔍 Trustverse AI Verification Report
          </h3>

          <p>
            <strong>Verification Status:</strong>{" "}
            <span className="text-emerald-600 font-semibold">
              Successfully Completed ✅
            </span>
          </p>

          <p>
            <strong>Final Risk Level:</strong>{" "}
            <span
              className={
                result.riskLevel === "Low Risk"
                  ? "text-green-600 font-bold"
                  : result.riskLevel === "Medium Risk"
                  ? "text-yellow-600 font-bold"
                  : "text-red-600 font-bold"
              }
            >
              {result.riskLevel}
            </span>
          </p>

          <p>
            <strong>Trust Score:</strong> {result.trustScore}/100
          </p>

          <div className="border-t pt-4 space-y-2 text-sm text-gray-700">
            <p className="font-semibold">🔎 Detailed Risk Analysis</p>
            <p>{result.analysis.summary}</p>

            <ul className="list-disc list-inside text-gray-600">
              {result.analysis.signals.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>

            <p className="mt-2">
              <strong>✅ Recommendation:</strong>{" "}
              {result.analysis.recommendation}
            </p>
          </div>

          {/* 🔥 PRO CREDIT DISPLAY FIX */}
          <div className="border-t pt-4 text-sm text-gray-600 space-y-1">
            {result.remainingCredits !== "unlimited" && (
              <p>
                <strong>Credits Used:</strong> 1
              </p>
            )}

            <p>
              <strong>Available Credits:</strong>{" "}
              {result.remainingCredits === "unlimited" ? (
                <span className="text-emerald-600 font-semibold">
                  Unlimited (PRO)
                </span>
              ) : (
                result.remainingCredits
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
