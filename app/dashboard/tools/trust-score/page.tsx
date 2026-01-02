"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { QRCodeCanvas } from "qrcode.react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import CreditWarningBanner from "@/components/CreditWarningBanner";

type TrustResult = {
  trustScore: number;
  riskLevel: "Low Risk" | "Medium Risk" | "High Risk";
  confidence: string;
  explanation: string;
  remainingCredits?: number;
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

    const userId = session?.user?.id;
    if (!userId) {
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
        body: JSON.stringify({
          text: value.trim(),
          userId,
        }),
      });

      const data = await res.json();

      // 🔥 FINAL ERROR HANDLING (credits / session)
      if (!res.ok) {
        if (res.status === 402) {
          alert("❌ No credits left. Please upgrade your plan.");
        } else if (res.status === 401) {
          alert("Session expired. Please login again.");
          router.push("/login");
        } else {
          alert(data?.error || "Service temporarily unavailable.");
        }
        return;
      }

      setResult(data);
      setValue("");

      // 🔄 Real-time updates
      window.dispatchEvent(new Event("credits-updated"));
      window.dispatchEvent(new Event("history-updated"));

    } catch (err) {
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
          Evaluate the trustworthiness of phone numbers, email addresses,
          usernames, or online profiles using AI-powered trust analysis
          before making important decisions.
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

      {/* 🔥 LONG DESCRIPTION (RESTORED FULLY) */}
      <div className="space-y-6 text-gray-700 max-w-3xl">
        <h2 className="text-xl font-semibold text-gray-900">
          How Trust Score Analyzer Works
        </h2>

        <p>
          Trust Score Analyzer helps identify potential scams, fraud, or risky
          online interactions before action is taken. It analyzes multiple
          behavioral and risk indicators using AI-powered models.
        </p>

        <p>
          Based on historical scam patterns and automated trust signals,
          Trustverse AI generates a{" "}
          <strong>Trust Score (0–100)</strong> along with a clear risk category.
        </p>

        <ul className="list-disc pl-6 space-y-2">
          <li>Detect fraudulent phone numbers or emails</li>
          <li>Identify suspicious usernames or profiles</li>
          <li>Reduce risk before financial interaction</li>
          <li>Make informed, safer decisions</li>
        </ul>

        <p className="font-medium text-gray-800">Risk Levels:</p>

        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Low Risk:</strong> No major warning signs</li>
          <li><strong>Medium Risk:</strong> Some caution advised</li>
          <li><strong>High Risk:</strong> Strong scam indicators detected</li>
        </ul>

        <p className="text-sm text-gray-500">
          Disclaimer: Results are automated insights only. Always verify
          critical information independently.
        </p>
      </div>

      {/* RESULT CARD */}
      {result && (
        <div
          ref={reportRef}
          className="bg-white border rounded-xl p-6 space-y-4 max-w-xl relative z-10"
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

          <p><strong>Trust Score:</strong> {result.trustScore}</p>
          <p><strong>Confidence:</strong> {result.confidence}</p>
          <p className="text-gray-700">{result.explanation}</p>

          {result.remainingCredits !== undefined && (
            <p className="text-sm text-gray-500">
              Remaining Credits: {result.remainingCredits}
            </p>
          )}

          <div className="pt-4">
            <QRCodeCanvas value={window.location.href} size={120} />
          </div>

          <div className="flex gap-4 pt-4">
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
          </div>
        </div>
      )}
    </div>
  );
}
