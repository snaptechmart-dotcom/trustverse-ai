"use client";

import { useState } from "react";

export default function PhoneCheckPage() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleVerify = async () => {
    if (!phone) {
      alert("Please enter a phone number");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      // ⚠️ Abhi dummy result (STEP 2.6 me API connect hoga)
      await new Promise((r) => setTimeout(r, 1000));

      const fakeResult = {
        status: "Verified",
        risk: "Low",
        carrier: "Unknown",
        country: "IN",
      };

      setResult(fakeResult);
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Phone Verification
        </h1>
        <p className="text-gray-500 mt-1">
          Verify phone numbers to detect spam, fraud, or risk signals
        </p>
      </div>

      {/* INPUT CARD */}
      <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4 max-w-xl">
        <input
          type="text"
          placeholder="Enter phone number with country code"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <button
          onClick={handleVerify}
          disabled={loading}
          className="bg-indigo-600 text-white px-5 py-2 rounded-md hover:bg-indigo-700 transition disabled:opacity-60"
        >
          {loading ? "Verifying..." : "Verify Phone"}
        </button>
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
          <p>
            <strong>Carrier:</strong> {result.carrier}
          </p>
          <p>
            <strong>Country:</strong> {result.country}
          </p>
        </div>
      )}

      {/* DESCRIPTION */}
      <div className="max-w-3xl text-gray-700 space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">
          How Phone Verification Works
        </h2>

        <p>
          Phone Verification helps you identify whether a phone number is
          genuine, risky, or potentially linked to spam or fraud activities.
        </p>

        <ul className="list-disc pl-5 space-y-2">
          <li>Detect fake or temporary numbers</li>
          <li>Identify high-risk or spam-associated numbers</li>
          <li>Improve trust before contacting unknown users</li>
        </ul>

        <p className="text-sm text-gray-500">
          Note: Verification results are generated using automated checks and
          external signals and should be used as guidance only.
        </p>
      </div>
    </div>
  );
}
