"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { QRCodeCanvas } from "qrcode.react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import CreditWarningBanner from "@/components/CreditWarningBanner";

/* =========================
   PLATFORMS (NO MISS)
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

export default function SocialAnalyzerPage() {
  const router = useRouter();
  const reportRef = useRef<HTMLDivElement>(null);

  const [text, setText] = useState("");
  const [platform, setPlatform] = useState(platforms[0]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [credits, setCredits] = useState<number | "unlimited">(0);

  /* =========================
     FETCH CREDITS
  ========================= */
  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const res = await fetch("/api/credits", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setCredits(data.credits);
        }
      } catch {}
    };
    fetchCredits();
    window.addEventListener("credits-updated", fetchCredits);
    return () =>
      window.removeEventListener("credits-updated", fetchCredits);
  }, []);

  /* =========================
     ANALYZE
  ========================= */
  const analyze = async () => {
    if (!text.trim()) {
      alert("Please enter a username, bio, or message.");
      return;
    }

    if (credits !== "unlimited" && credits < 2) {
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
        body: JSON.stringify({ text: text.trim(), platform }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        alert(data?.error || "Service temporarily unavailable");
        return;
      }

      setResult(data);
      setText("");
      window.dispatchEvent(new Event("credits-updated"));
      window.dispatchEvent(new Event("history-updated"));
    } catch {
      setLoading(false);
      alert("Network error. Please try again.");
    }
  };

  /* =========================
     PDF
  ========================= */
  const downloadPDF = async () => {
    if (!reportRef.current) return;
    const canvas = await html2canvas(reportRef.current, { scale: 2 });
    const img = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const w = 210;
    const h = (canvas.height * w) / canvas.width;

    pdf.addImage(img, "PNG", 0, 0, w, h);
    pdf.save("Trustverse_Social_Report.pdf");
  };

  /* =========================
     SHARE (WA + TG)
  ========================= */
  const shareReport = () => {
    if (!result) return;

    const textShare = `
Trustverse AI™ – Social Trust Intelligence Report

Platform: ${platform}
Trust Score: ${result.trustScore}/100
Risk Level: ${result.riskLevel}

${result.details.recommendation}

https://trustverseai.com
`.trim();

    const encoded = encodeURIComponent(textShare);
    window.open(`https://wa.me/?text=${encoded}`, "_blank");
    window.open(
      `https://t.me/share/url?url=https://trustverseai.com&text=${encoded}`,
      "_blank"
    );
  };

  return (
    <div className="space-y-12 max-w-5xl">
      {credits !== "unlimited" && <CreditWarningBanner />}

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">
          Trustverse AI™ Social Profile Analyzer{" "}
          <span className="text-purple-600">(PRO)</span>
        </h1>
        <p className="text-gray-600 mt-2 max-w-3xl">
          Advanced AI-powered analysis to detect fake profiles, impersonation,
          and social engineering risks before engagement.
        </p>
      </div>

      {/* INPUT */}
      <div className="bg-white border rounded-xl p-6 space-y-4 max-w-xl">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste username, bio, or social message"
          className="w-full border rounded-md px-4 py-3"
        />

        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          className="w-full border rounded-md px-4 py-2"
        >
          {platforms.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>

        <button
          onClick={analyze}
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded"
        >
          {loading ? "Analyzing..." : "Analyze Profile"}
        </button>
      </div>

      {/* RESULT CARD */}
      {result && (
        <div
          ref={reportRef}
          className="bg-white border-2 border-purple-600 rounded-2xl p-6 max-w-xl space-y-6 shadow-lg"
        >
          <p className="text-green-600 font-semibold text-sm">
            ✅ Analysis completed successfully
          </p>

          <h3 className="text-xl font-bold text-purple-700">
            Trustverse AI™ Verified Social Intelligence Report
          </h3>

          <div className="text-center">
            <p className="text-sm text-gray-500">Trust Score</p>
            <p className="text-4xl font-extrabold text-purple-700">
              {result.trustScore}
              <span className="text-base text-gray-500"> /100</span>
            </p>
          </div>

          <div className="flex justify-center">
            <span
              className={`px-4 py-1 rounded-full text-sm font-bold ${
                result.riskLevel === "Low Risk"
                  ? "bg-green-100 text-green-700"
                  : result.riskLevel === "Medium Risk"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {result.riskLevel}
            </span>
          </div>

          <div className="bg-slate-50 border rounded p-4">
            <p className="font-semibold mb-2">
              🔍 AI Risk Signals Detected
            </p>
            <ul className="list-disc pl-5 text-sm space-y-1">
              {result.details.indicators.map((s: string, i: number) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>

          <div className="bg-purple-50 border-l-4 border-purple-600 p-4 rounded">
            <p className="font-semibold mb-2">
              What does this mean for you?
            </p>
            <p className="text-gray-700 leading-relaxed">
              {result.details.recommendation}
            </p>
          </div>

          <div className="flex justify-center">
            <QRCodeCanvas value={window.location.href} size={120} />
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={shareReport}
              className="bg-emerald-600 text-white px-4 py-2 rounded"
            >
              Share
            </button>
            <button
              onClick={downloadPDF}
              className="bg-black text-white px-4 py-2 rounded"
            >
              Download PDF
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

          <p className="text-sm text-center text-gray-500">
            Credits Used: <b>2</b> • Remaining:{" "}
            <b>
              {result.remainingCredits === "unlimited"
                ? "Unlimited (PRO)"
                : result.remainingCredits}
            </b>
          </p>
        </div>
      )}

      {/* 🔵 LONG DESCRIPTION – ALWAYS VISIBLE */}
      <div className="space-y-5 text-gray-700 max-w-4xl">
        <h2 className="text-xl font-semibold text-gray-900">
          How Trustverse AI™ Social Profile Analyzer Works
        </h2>

        <p>
          Trustverse AI™ Social Profile Analyzer evaluates public social media
          usernames, bios, and message content using behavioral intelligence and
          scam-detection models. The system is designed to identify impersonation
          attempts, manipulation language, and social engineering patterns.
        </p>

        <p>
          Each analysis produces a <strong>Trust Score (0–100)</strong>, a clear
          risk classification, and a human-readable explanation to help users
          make informed decisions before engaging with unknown profiles.
        </p>

        <ul className="list-disc pl-6 space-y-2">
          <li>Detect fake or impersonated social accounts</li>
          <li>Identify scam-linked behavioral patterns</li>
          <li>Reduce social engineering and fraud risk</li>
          <li>Increase confidence before online engagement</li>
        </ul>

        <p className="text-sm text-gray-500">
          Disclaimer: Results are generated using automated analysis and are
          intended for guidance only. Always apply independent verification for
          critical decisions.
        </p>
      </div>

      {/* 🟣 FAQ SECTION */}
      <div className="mt-16 max-w-4xl space-y-6 text-gray-700">
        <h2 className="text-2xl font-bold text-gray-900">
          Social Profile Analyzer – Frequently Asked Questions
        </h2>

        <p>
          <strong>How does Trustverse AI Social Analyzer work?</strong><br />
          It evaluates publicly available social profile content using AI-driven
          behavioral signals, impersonation indicators, and scam intelligence.
        </p>

        <p>
          <strong>Can results change over time?</strong><br />
          Yes. Results may vary slightly as profile behavior and risk indicators
          evolve.
        </p>

        <p>
          <strong>Does this tool access private data?</strong><br />
          No. Trustverse AI only analyzes public information and user-provided
          content.
        </p>

        <p>
          <strong>Is this report legally binding?</strong><br />
          No. Reports are informational and intended for awareness only.
        </p>
      </div>

      {/* FAQ SCHEMA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "How does Trustverse AI Social Analyzer work?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text:
                    "Trustverse AI Social Analyzer evaluates publicly available social profile content using behavioral intelligence and scam detection signals."
                }
              },
              {
                "@type": "Question",
                name: "Can Social Analyzer results change?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text:
                    "Yes. Results may change as profile behavior and contextual risk indicators evolve."
                }
              }
            ]
          }),
        }}
      />
    </div>
  );
}
