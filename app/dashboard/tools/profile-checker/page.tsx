"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CreditWarningBanner from "@/components/CreditWarningBanner";

type ResultType = {
  status: string;
  name: string;
  email: string;
  phone: string;
  trustScore: number;
  riskLevel: "Low Risk" | "Medium Risk" | "High Risk";
  remainingCredits: number | "unlimited";
};

export default function ProfileCheckerPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResultType | null>(null);

  const router = useRouter();

  const handleCheck = async () => {
    if (!name.trim() || !email.trim()) {
      alert("Name and Email are required.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/profile-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
        }),
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
        alert("Service temporarily unavailable.");
        return;
      }

      const data: ResultType = await res.json();
      setResult(data);

      setName("");
      setEmail("");
      setPhone("");
      window.dispatchEvent(new Event("credits-updated"));
    } catch (err) {
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 max-w-4xl">
      <CreditWarningBanner />

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Profile Trust Checker
        </h1>
        <p className="text-gray-500 mt-2 max-w-3xl">
          Analyze basic profile details to estimate trustworthiness and risk
          level before engaging in communication, business, or transactions.
        </p>
      </div>

      {/* INPUT CARD */}
      <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4 max-w-xl">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter full name"
          className="w-full bg-slate-50 border border-slate-300 rounded-md px-4 py-2
          focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email address"
          className="w-full bg-slate-50 border border-slate-300 rounded-md px-4 py-2
          focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />

        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone number (optional)"
          className="w-full bg-slate-50 border border-slate-300 rounded-md px-4 py-2
          focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />

        <button
          onClick={handleCheck}
          disabled={loading}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-md
          transition disabled:opacity-60"
        >
          {loading ? "Checking..." : "Check Profile"}
        </button>
      </div>

      {/* RESULT */}
      {result && (
        <div className="bg-white border rounded-xl p-6 max-w-2xl space-y-5">
          <h3 className="text-xl font-semibold text-gray-900">
            👤 Trustverse AI Profile Trust Report
          </h3>

          <p>
            <strong>Verification Status:</strong>{" "}
            <span className="text-emerald-600 font-semibold">
              Successfully Completed ✅
            </span>
          </p>

          <p className="text-sm text-gray-700">
            <strong>Name:</strong> {result.name}
          </p>
          <p className="text-sm text-gray-700">
            <strong>Email:</strong> {result.email}
          </p>
          <p className="text-sm text-gray-700">
            <strong>Phone:</strong> {result.phone}
          </p>

          <div className="space-y-2 text-gray-700">
            <p>
              <strong>Trust Assessment Summary:</strong>
            </p>
            <p className="text-sm leading-relaxed">
              Our system analyzed the provided profile information using
              automated trust indicators. Based on available data signals, this
              profile demonstrates a{" "}
              <strong>{result.riskLevel}</strong> confidence level.
            </p>
          </div>

          <p>
            <strong>Trust Score:</strong>{" "}
            <span className="font-bold text-blue-600">
              {result.trustScore} / 100
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

          <div className="border-t pt-4 text-sm text-gray-600 space-y-1">
            <p>
              <strong>Credits Used:</strong> 1
            </p>
            <p>
              <strong>Available Credits:</strong>{" "}
              {result.remainingCredits === "unlimited"
                ? "Unlimited"
                : result.remainingCredits}
            </p>
          </div>

          <p className="text-xs text-gray-500 italic">
            This result is generated using automated indicators and is intended
            for guidance only. Upgrade to Pro for deeper trust insights.
          </p>
        </div>
      )}

      {/* DESCRIPTION */}
      <div className="space-y-6 text-gray-700 max-w-3xl">
        <h2 className="text-xl font-semibold text-gray-900">
          How Profile Trust Checker Works
        </h2>

        <p>
          Profile Trust Checker helps assess the overall trustworthiness of an
          individual or online profile using basic identity signals. It is
          designed to provide early risk awareness before engaging in
          communication, hiring, collaboration, or transactions.
        </p>

        <p>
          The system evaluates factors such as name consistency, email patterns,
          optional phone presence, and common trust indicators to generate a
          confidence score and risk level.
        </p>

        <ul className="list-disc pl-6 space-y-2">
          <li>Identify potentially risky or incomplete profiles</li>
          <li>Assess trust level before business or freelance engagement</li>
          <li>Reduce exposure to fake identities or impersonation</li>
          <li>Support safer onboarding and decision-making</li>
        </ul>

        <p className="text-sm text-gray-500">
          Disclaimer: This analysis is generated using automated indicators and
          does not guarantee identity authenticity. Results should be used as
          guidance alongside human judgment.
        </p>
      </div>
    </div>
  );
}
