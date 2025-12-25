"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CreditWarningBanner from "@/components/CreditWarningBanner";

export default function PhoneCheckPage() {
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState<any>(null);
  const router = useRouter();

  const handleCheck = async () => {
    if (!phone) return alert("Enter phone number");

    const res = await fetch("/api/phone-check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });

    if (res.status === 402) {
      alert("Credits finished. Upgrade to Pro.");
      router.push("/pricing");
      return;
    }

    setResult(await res.json());
  };

  return (
    <div className="space-y-8">
      <CreditWarningBanner />

      <div>
        <h1 className="text-3xl font-bold">Phone Number Checker</h1>
        <p className="text-gray-500 mt-1">
          Verify phone numbers to identify spam, fraud, or risky activity.
        </p>
      </div>

      <div className="bg-white border rounded-xl p-6 max-w-xl space-y-4">
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter phone number with country code"
          className="w-full bg-slate-50 border border-slate-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-emerald-500"
        />

        <button
          onClick={handleCheck}
          className="bg-emerald-600 text-white px-5 py-2 rounded-md"
        >
          Check Number
        </button>
      </div>

      <div className="max-w-3xl text-gray-700 space-y-3">
        <h2 className="text-lg font-semibold">Why use this tool</h2>
        <p>
          Phone Checker analyzes carrier data, usage patterns, and reported
          activity to help you avoid scam calls or fraudulent numbers.
        </p>
        <ul className="list-disc pl-5">
          <li>Identify spam or fake numbers</li>
          <li>Check country & risk level</li>
          <li>Improve contact safety</li>
        </ul>
      </div>

      {result && (
        <div className="bg-white border rounded-xl p-6 max-w-xl">
          <p><b>Status:</b> {result.status}</p>
          <p><b>Risk:</b> {result.risk}</p>
        </div>
      )}
    </div>
  );
}
