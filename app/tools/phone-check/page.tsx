"use client";
import { useState } from "react";

export default function PhoneCheck() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  const checkPhone = async () => {
    setLoading(true);
    setData(null);

    const res = await fetch("/api/phone-check", {
      method: "POST",
      body: JSON.stringify({ phone }),
    });

    const json = await res.json();
    setData(json.data);
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-5">
      <h1 className="text-3xl font-bold text-center mb-6">📞 Phone Checker</h1>

      <input
        type="text"
        placeholder="Enter phone number..."
        className="w-full p-3 border rounded-lg bg-gray-900 text-white"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <button
        onClick={checkPhone}
        className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-lg font-semibold"
        disabled={loading}
      >
        {loading ? "Checking..." : "Check Phone"}
      </button>

      {data && (
        <div className="mt-8 p-6 bg-gray-800 text-white rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">📊 Result</h2>

          <p>
            <strong>Phone:</strong> {data.phone}
          </p>

          <p>
            <strong>Exists in Database:</strong>{" "}
            <span className={data.exists ? "text-green-400" : "text-red-400"}>
              {data.exists ? "Yes" : "No"}
            </span>
          </p>

          <p>
            <strong>Risk Level:</strong>{" "}
            <span
              className={
                data.risk === "Low"
                  ? "text-green-400"
                  : data.risk === "Medium"
                  ? "text-yellow-400"
                  : "text-red-400"
              }
            >
              {data.risk}
            </span>
          </p>

          <p>
            <strong>Spam Score:</strong> {data.spamScore}%
          </p>

          <p>
            <strong>Last Seen:</strong> {data.lastSeen}
          </p>
        </div>
      )}
    </div>
  );
}
