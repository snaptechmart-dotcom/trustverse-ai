"use client";
import { useState } from "react";

export default function SocialAnalyzer() {
  const [platform, setPlatform] = useState("Facebook");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  const analyze = async () => {
    setLoading(true);
    setAnalysis(null);

    const res = await fetch("/api/social-analyzer", {
      method: "POST",
      body: JSON.stringify({ platform, username }),
    });

    const json = await res.json();
    setAnalysis(json.analysis);
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-5">
      <h1 className="text-3xl font-bold text-center mb-6">
        🌐 Social Profile Analyzer
      </h1>

      <div className="bg-gray-900 p-6 rounded-lg space-y-4">
        <select
          className="w-full p-3 rounded bg-gray-800 text-white border"
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
        >
          <option>Facebook</option>
          <option>Instagram</option>
          <option>Twitter</option>
          <option>LinkedIn</option>
        </select>

        <input
          type="text"
          placeholder="Enter username..."
          className="w-full p-3 rounded bg-gray-800 text-white border"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <button
          onClick={analyze}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-lg font-semibold"
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Analyze Profile"}
        </button>
      </div>

      {analysis && (
        <div className="mt-8 p-6 bg-gray-800 text-white rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">📊 Results</h2>

          <p>
            <strong>Platform:</strong> {analysis.platform}
          </p>

          <p>
            <strong>Username:</strong> {analysis.username}
          </p>

          <p>
            <strong>Profile Exists:</strong>{" "}
            <span className={analysis.profileExists ? "text-green-400" : "text-red-400"}>
              {analysis.profileExists ? "Yes" : "No"}
            </span>
          </p>

          <p>
            <strong>Followers:</strong> {analysis.followers}
          </p>

          <p>
            <strong>Risk Level:</strong>{" "}
            <span
              className={
                analysis.risk === "Low"
                  ? "text-green-400"
                  : analysis.risk === "Medium"
                  ? "text-yellow-400"
                  : "text-red-400"
              }
            >
              {analysis.risk}
            </span>
          </p>

          <p>
            <strong>Activity Score:</strong> {analysis.activityScore}%
          </p>
        </div>
      )}
    </div>
  );
}
