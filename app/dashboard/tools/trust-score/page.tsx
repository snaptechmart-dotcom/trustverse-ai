"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { QRCodeCanvas } from "qrcode.react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import CreditWarningBanner from "@/components/CreditWarningBanner";

/* ======================
   TYPES
====================== */
type TrustResult = {
  trustScore: number;
  riskLevel: "Low Risk" | "Medium Risk" | "High Risk";
  confidence: string;
  explanation: string;
  remainingCredits?: number | "unlimited";
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
        alert(data?.error || "Service temporarily unavailable.");
        return;
      }

      setResult(data);
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
     SHARE
  ====================== */
  const shareResult = async () => {
    if (!result) return;

    const text = `Trustverse AI – Trust Score Report

Trust Score: ${result.trustScore}/100
Risk Level: ${result.riskLevel}

${result.explanation}

Verified by Trustverse AI
https://trustverseai.com
`;

    const encoded = encodeURIComponent(text);

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Trustverse AI Report",
          text,
          url: "https://trustverseai.com",
        });
        return;
      } catch {}
    }

    window.open(`https://wa.me/?text=${encoded}`, "_blank");
    window.open(
      `https://t.me/share/url?url=https://trustverseai.com&text=${encoded}`,
      "_blank"
    );
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
    <div className="space-y-10 max-w-4xl">
      <CreditWarningBanner />

      {/* HEADER */}
      <h1 className="text-3xl font-bold">Trust Score Analyzer</h1>

      {/* INPUT BOX */}
      <div className="bg-white border rounded-xl p-6 space-y-4 max-w-xl">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter phone number, email, or username"
          className="w-full border rounded-md px-4 py-2"
        />

        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="bg-indigo-600 text-white px-6 py-2 rounded disabled:opacity-60"
        >
          {loading ? "Analyzing..." : "Analyze Trust"}
        </button>
      </div>

      {/* LONG DESCRIPTION */}
      <div className="bg-gray-50 border rounded-xl p-6 max-w-3xl">
        <h2 className="text-lg font-semibold mb-2">
          What is Trust Score Analyzer?
        </h2>

        <p className="text-gray-700 leading-relaxed">
          The Trust Score Analyzer helps you evaluate the trustworthiness of
          phone numbers, email addresses, usernames, and online profiles.
          <br /><br />
          Trustverse AI uses advanced pattern analysis, behavioral signals,
          and risk heuristics to generate a trust score between
          <b> 0–100</b>.
          <br /><br />
          A higher score indicates lower risk, while a lower score suggests
          potential fraud, spam, or scam behavior.
        </p>
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
            <b>Risk Level:</b>{" "}
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
            <b>Trust Score:</b> {result.trustScore} / 100
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

          <QRCodeCanvas value="https://trustverseai.com" size={120} />

          <div className="flex flex-wrap gap-3 pt-4">
            <button
              onClick={downloadPDF}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Download PDF
            </button>

            <button
              onClick={reportAsScam}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Report as Scam
            </button>

            <button
              onClick={shareResult}
              className="bg-emerald-600 text-white px-4 py-2 rounded"
            >
              Share
            </button>
          </div>
        </div>
      )}

      {/* =========================
          FAQ SECTION (NEW)
      ========================= */}
      <div className="max-w-3xl space-y-6 border-t pt-10">
        <h2 className="text-2xl font-bold text-gray-900">
          Trust Score Analyzer – FAQs
        </h2>

        <div>
          <h3 className="font-semibold">
            What does the Trust Score represent?
          </h3>
          <p className="text-sm text-gray-600">
            The Trust Score represents the likelihood that a phone number,
            email, or username is safe to engage with. Higher scores indicate
            lower risk based on behavioral and reputation signals.
          </p>
        </div>

        <div>
          <h3 className="font-semibold">
            Can a high Trust Score guarantee safety?
          </h3>
          <p className="text-sm text-gray-600">
            No system can guarantee complete safety. Trustverse AI provides
            risk intelligence to support decisions, not absolute certainty.
          </p>
        </div>

        <div>
          <h3 className="font-semibold">
            Why can the same input give slightly different results?
          </h3>
          <p className="text-sm text-gray-600">
            Trust scores may vary due to dynamic risk modeling, evolving scam
            patterns, and contextual signal weighting.
          </p>
        </div>

        <div>
          <h3 className="font-semibold">
            Who should use Trust Score Analyzer?
          </h3>
          <p className="text-sm text-gray-600">
            This tool is useful for individuals, businesses, and professionals
            who want to assess trust before communication, payments, or data
            sharing.
          </p>
        </div>
      </div>
    </div>
  );
}
