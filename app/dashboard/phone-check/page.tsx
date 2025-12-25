"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CreditWarningBanner from "@/components/CreditWarningBanner";

export default function PhoneCheckPage() {
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState<any>(null);
  const router = useRouter();

  const handleCheck = async () => {
    if (!phone) {
      alert("Please enter a phone number with country code");
      return;
    }

    const res = await fetch("/api/phone-check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });

    if (res.status === 402) {
      alert("Your credits are finished. Please upgrade to Pro.");
      router.push("/pricing");
      return;
    }

    setResult(await res.json());
  };

  return (
    <div className="space-y-10 max-w-4xl">
      {/* CREDIT WARNING */}
      <CreditWarningBanner />

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Phone Number Checker
        </h1>
        <p className="text-gray-500 mt-2 max-w-3xl">
          Analyze phone numbers to detect spam activity, fraud risks, or
          suspicious behavior before answering calls or sharing sensitive
          information.
        </p>
      </div>

      {/* INPUT CARD */}
      <div className="bg-white border rounded-xl p-6 max-w-xl space-y-4 shadow-sm">
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter phone number with country code (e.g. +1XXXXXXXXXX)"
          className="w-full bg-slate-50 border border-slate-300 rounded-md px-4 py-2
          focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />

        <button
          onClick={handleCheck}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-md transition"
        >
          Check Number
        </button>
      </div>

      {/* DESCRIPTION */}
      <div className="max-w-3xl text-gray-700 space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">
          How Phone Number Checker Works
        </h2>

        <p>
          Phone Number Checker is an AI-powered verification tool designed to
          help users identify potentially risky or fraudulent phone numbers.
          The system analyzes multiple automated signals to determine whether a
          number appears safe, suspicious, or high risk.
        </p>

        <p>
          By evaluating calling behavior patterns, reported spam indicators,
          and usage consistency, the tool provides a clear risk assessment to
          support safer communication decisions.
        </p>

        <ul className="list-disc pl-6 space-y-2">
          <li>Detect spam, scam, or fraudulent phone numbers</li>
          <li>Identify numbers associated with suspicious activity</li>
          <li>Reduce the risk of financial or identity-related fraud</li>
          <li>Make informed decisions before responding to unknown calls</li>
        </ul>

        <p>
          <strong>Risk Levels Explained:</strong>
        </p>

        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Low Risk:</strong> No major spam or fraud indicators
            detected.
          </li>
          <li>
            <strong>Medium Risk:</strong> Some warning signals found; caution is
            recommended.
          </li>
          <li>
            <strong>High Risk:</strong> Strong spam or fraud patterns detected.
            Avoid interaction unless verified through trusted sources.
          </li>
        </ul>

        <p className="text-sm text-gray-500">
          Disclaimer: Phone Number Checker provides automated risk insights for
          guidance purposes only. Results should be combined with personal
          judgment and additional verification when required.
        </p>
      </div>

      {/* RESULT */}
      {result && (
        <div className="bg-white border rounded-xl p-6 max-w-xl space-y-2">
          <p>
            <strong>Status:</strong> {result.status}
          </p>
          <p>
            <strong>Risk Level:</strong> {result.risk}
          </p>
        </div>
      )}
    </div>
  );
}
