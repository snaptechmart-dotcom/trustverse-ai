"use client";
import { useState } from "react";

export default function TrustScorePage() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const analyze = async () => {
    setLoading(true);
    setResult(null);

    const res = await fetch("/api/trust-score", {
      method: "POST",
      body: JSON.stringify({ text }),
    });

    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-5">
      <h1 className="text-3xl font-bold text-center mb-6">
        🔍 Trust Score Analyzer
      </h1>

      <textarea
        className="w-full p-4 border rounded-lg bg-gray-900 text-white"
        rows={5}
        placeholder="Enter text to analyze trust score..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button
        onClick={analyze}
        disabled={loading}
        className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-lg font-semibold"
      >
        {loading ? "Analyzing..." : "Analyze Trust Score"}
      </button>

      {result && (
        <div className="mt-8 p-6 bg-gray-800 rounded-lg text-white shadow-lg">
          <h2 className="text-xl font-semibold mb-3">📊 Results</h2>

          <p>
            <strong>Trust Score:</strong>{" "}
            <span className="text-green-400">{result.trustScore}%</span>
          </p>

          <p>
            <strong>Risk Level:</strong>{" "}
            <span
              className={
                result.risk === "Low"
                  ? "text-green-400"
                  : result.risk === "Medium"
                  ? "text-yellow-400"
                  : "text-red-400"
              }
            >
              {result.risk}
            </span>
          </p>

          <p>
            <strong>Confidence:</strong> {result.confidence}
          </p>
        </div>
      )}
    </div>
  );
}
