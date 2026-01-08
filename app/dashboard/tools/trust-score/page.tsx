"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { QRCodeCanvas } from "qrcode.react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import CreditWarningBanner from "@/components/CreditWarningBanner";

/* ======================
   TYPES (FIXED)
====================== */
type TrustResult = {
  trustScore: number;
  riskLevel: "Low Risk" | "Medium Risk" | "High Risk";
  confidence: string;
  explanation: string;
  remainingCredits?: number | "unlimited";
  share?: {
    title: string;
    text: string;
  };
};

export default function TrustScorePage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TrustResult | null>(null);

  const reportRef = useRef<HTMLDivElement>(null);

  /* ======================
     RUN ANALYSIS
  ====================== */
  const handleAnalyze = async () => {
    if (!value.trim()) {
      alert("Please enter phone number, email, or username.");
      return;
    }

    if (!session?.user?.id) {
      alert("Session expired. Please login again.");
      router.push("/login");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/trust-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: value.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 402) {
          alert("No credits left. Please upgrade your plan.");
        } else if (res.status === 401) {
          alert("Session expired. Please login again.");
          router.push("/login");
        } else {
          alert(data?.error || "Service temporarily unavailable.");
        }
        return;
      }

      setResult({
        ...data,
        share: {
          title: "Trustverse AI Trust Report",
          text: `Trust Score: ${data.trustScore}/100\nRisk Level: ${data.riskLevel}`,
        },
      });

      setValue("");
      window.dispatchEvent(new Event("credits-updated"));
      window.dispatchEvent(new Event("history-updated"));
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ======================
     DOWNLOAD PDF
  ====================== */
  const downloadPDF = async () => {
    if (!reportRef.current) return;

    const canvas = await html2canvas(reportRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = 210;
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("Trustverse_AI_Trust_Score_Report.pdf");
  };

  /* ======================
     REPORT AS SCAM
  ====================== */
  const reportAsScam = () => {
    if (!result) return;

    router.push(
      `/report-scam?source=trust-score&risk=${result.riskLevel}&score=${result.trustScore}`
    );
  };

  return (
    <div className="space-y-12 max-w-4xl">
      <CreditWarningBanner />

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Trust Score Analyzer</h1>
        <p className="text-gray-500 mt-2 max-w-3xl">
          Evaluate trustworthiness of phone numbers, emails, usernames, or
          profiles using AI-powered risk analysis.
        </p>
      </div>

      {/* INPUT */}
      <div className="bg-white border rounded-xl p-6 space-y-4 max-w-xl">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter phone number, email, or username"
          className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-indigo-500"
        />

        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded disabled:opacity-60"
        >
          {loading ? "Analyzing..." : "Analyze Trust"}
        </button>
      </div>

      {/* LONG DESCRIPTION */}
      <div className="space-y-6 text-gray-700 max-w-3xl">
        <h2 className="text-xl font-semibold">How Trust Score Analyzer Works</h2>
        <p>
          Trustverse AI evaluates risk indicators, scam patterns, and behavioral
          signals to generate a trust score between 0–100.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Detect fraud & scam signals</li>
          <li>Assess digital trust before action</li>
          <li>Reduce financial & identity risk</li>
        </ul>
      </div>

      {/* RESULT */}
      {result && (
        <div
          ref={reportRef}
          className="bg-white border rounded-xl p-6 space-y-4 max-w-xl"
        >
          <h3 className="text-xl font-semibold">
            🧠 Trustverse AI Trust Score Report
          </h3>

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

          <p>
            <strong>Trust Score:</strong> {result.trustScore} / 100
          </p>

          <p>
            <strong>Confidence:</strong> {result.confidence}
          </p>

          <p className="text-gray-700">{result.explanation}</p>

          {result.remainingCredits !== undefined && (
            <p className="text-sm text-gray-500">
              Remaining Credits:{" "}
              {result.remainingCredits === "unlimited"
                ? "Unlimited (PRO)"
                : result.remainingCredits}
            </p>
          )}

          <div className="pt-4">
            <QRCodeCanvas value={window.location.href} size={120} />
          </div>

          <div className="flex flex-wrap gap-4 pt-4">
            <button
              onClick={downloadPDF}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Download PDF
            </button>

            <button
              onClick={reportAsScam}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
            >
              Report as Scam
            </button>

            {result.share && (
              <button
                onClick={async () => {
                  if (navigator.share) {
                    await navigator.share({
                      title: result.share!.title,
                      text: result.share!.text,
                    });
                  } else {
                    await navigator.clipboard.writeText(
                      result.share!.text
                    );
                    alert("Report copied to clipboard");
                  }
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded"
              >
                Share
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
