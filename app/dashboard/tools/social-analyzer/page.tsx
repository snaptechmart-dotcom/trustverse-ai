"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { QRCodeCanvas } from "qrcode.react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import CreditWarningBanner from "@/components/CreditWarningBanner";

/* =========================
   CONSTANTS
========================= */
const platforms = [
  "Instagram",
  "Facebook",
  "Twitter / X",
  "LinkedIn",
  "YouTube",
  "TikTok",
  "WhatsApp",
  "Telegram",
  "Discord",
  "Snapchat",
  "Reddit",
  "Quora",
  "Medium",
  "GitHub",
  "Stack Overflow",
];

/* =========================
   TYPES
========================= */
type ResultType = {
  platform: string;
  username: string;
  accountType: string;
  riskLevel: "Low Risk" | "Medium Risk" | "High Risk";
  trustScore: number;
  remainingCredits: number | "unlimited";
};

export default function SocialAnalyzerPage() {
  const router = useRouter();
  const reportRef = useRef<HTMLDivElement>(null);

  const [username, setUsername] = useState("");
  const [platform, setPlatform] = useState(platforms[0]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResultType | null>(null);
  const [credits, setCredits] = useState<number | "unlimited">(0);

  /* =========================
     FETCH CREDITS
  ========================= */
  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const res = await fetch("/api/credits", { credentials: "include" });
        if (!res.ok) return;
        const data = await res.json();
        setCredits(data.credits ?? 0);
      } catch {}
    };

    fetchCredits();
    window.addEventListener("credits-updated", fetchCredits);
    return () =>
      window.removeEventListener("credits-updated", fetchCredits);
  }, []);

  /* =========================
     ANALYZE PROFILE
  ========================= */
  const analyzeProfile = async () => {
    if (!username.trim()) {
      alert("Please enter a username or profile link.");
      return;
    }

    if (credits !== "unlimited" && credits <= 0) {
      alert("No credits left. Please upgrade your plan.");
      router.push("/pricing");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/social-analyzer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          platform,
          username: username.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) router.push("/login");
        if (res.status === 402 || res.status === 403)
          router.push("/pricing");
        alert(data?.error || "Service temporarily unavailable");
        return;
      }

      const accountType = data.analysis.profileExists
        ? "Likely Genuine Account"
        : "Potentially Suspicious Account";

      setResult({
        platform,
        username,
        accountType,
        riskLevel: data.analysis.riskLevel,
        trustScore: data.analysis.trustScore,
        remainingCredits: data.remainingCredits,
      });

      setUsername("");
      setPlatform(platforms[0]);

      window.dispatchEvent(new Event("credits-updated"));
      window.dispatchEvent(new Event("history-updated"));
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     DOWNLOAD PDF
  ========================= */
  const downloadPDF = async () => {
    if (!reportRef.current) return;
    const canvas = await html2canvas(reportRef.current, { scale: 2 });
    const img = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const w = 210;
    const h = (canvas.height * w) / canvas.width;

    pdf.addImage(img, "PNG", 0, 0, w, h);
    pdf.save("Trustverse_Social_Profile_Report.pdf");
  };

  /* =========================
     SHARE
  ========================= */
  const shareReport = async () => {
    if (!result) return;

    const text = `Trustverse AI – Social Profile Report
Platform: ${result.platform}
Username: ${result.username}
Trust Score: ${result.trustScore}/100
Risk Level: ${result.riskLevel}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Trustverse AI – Social Profile Report",
          text,
        });
        return;
      }
    } catch {}

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    alert("Report copied to clipboard");
  };

  return (
    <div className="space-y-12 max-w-4xl">
      {credits !== "unlimited" && <CreditWarningBanner />}

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Social Profile Analyzer <span className="text-purple-600">(PRO)</span>
        </h1>
        <p className="text-gray-500 mt-2 max-w-3xl">
          Analyze social media usernames and public profiles to detect fake
          accounts, impersonation risks, and suspicious behavior before engaging.
        </p>
      </div>

      {/* INPUT */}
      <div className="bg-white border rounded-xl p-6 space-y-4 max-w-xl shadow-sm">
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username or profile URL"
          className="w-full border rounded-md px-4 py-2"
        />

        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          className="w-full border rounded-md px-4 py-2"
        >
          {platforms.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        <button
          onClick={analyzeProfile}
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded"
        >
          {loading ? "Analyzing..." : "Analyze Profile"}
        </button>
      </div>

      {/* 🔥 LONG DESCRIPTION (FINAL ADD) */}
      <div className="space-y-6 text-gray-700 max-w-3xl">
        <h2 className="text-xl font-semibold text-gray-900">
          How Social Profile Analyzer Works
        </h2>

        <p>
          Social Profile Analyzer evaluates public social media usernames and
          profile links using automated behavioral signals and risk indicators.
          It helps identify fake accounts, impersonation attempts, and scam-linked
          profiles before any interaction.
        </p>

        <p>
          Trustverse AI analyzes profile existence, activity patterns, naming
          behavior, and known scam indicators to generate a{" "}
          <strong>Trust Score (0–100)</strong> along with a clear risk category.
        </p>

        <ul className="list-disc pl-6 space-y-2">
          <li>Detect fake or impersonated social accounts</li>
          <li>Identify suspicious username patterns</li>
          <li>Reduce scam and fraud exposure</li>
          <li>Improve safety before online engagement</li>
        </ul>

        <p className="text-sm text-gray-500">
          Disclaimer: Results are generated using automated indicators and are
          intended for guidance only. Always apply independent verification for
          critical decisions.
        </p>
      </div>

      {/* RESULT */}
      {result && (
        <div
          ref={reportRef}
          className="bg-white border rounded-xl p-6 max-w-xl space-y-4"
        >
          <h3 className="text-xl font-semibold">
            🔍 Trustverse AI Social Verification Report
          </h3>

          <p><strong>Platform:</strong> {result.platform}</p>
          <p><strong>Username:</strong> {result.username}</p>

          <p>
            <strong>Account Type:</strong>{" "}
            <span
              className={
                result.accountType.includes("Genuine")
                  ? "text-green-600 font-bold"
                  : "text-red-600 font-bold"
              }
            >
              {result.accountType}
            </span>
          </p>

          <p>
            <strong>Trust Score:</strong>{" "}
            <span className="text-blue-600 font-bold">
              {result.trustScore} / 100
            </span>
          </p>

          <p>
            <strong>Risk Level:</strong>{" "}
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
            <p><strong>Credits Used:</strong> 2</p>
            <p>
              <strong>Available Credits:</strong>{" "}
              {result.remainingCredits === "unlimited"
                ? "Unlimited (PRO)"
                : result.remainingCredits}
            </p>
          </div>

          <QRCodeCanvas value={window.location.href} size={120} />

          <div className="flex flex-wrap gap-3 pt-4">
            <button
              onClick={downloadPDF}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Download PDF
            </button>

            <button
              onClick={shareReport}
              className="bg-emerald-600 text-white px-4 py-2 rounded"
            >
              Share
            </button>

            <button
              onClick={() =>
                router.push(
                  `/report-scam?source=social-analyzer&risk=${result.riskLevel}&score=${result.trustScore}`
                )
              }
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Report Scam
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
