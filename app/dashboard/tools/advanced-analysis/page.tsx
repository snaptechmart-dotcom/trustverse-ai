"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { QRCodeCanvas } from "qrcode.react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import CreditWarningBanner from "@/components/CreditWarningBanner";

type ResultType = {
  trustScore: number;
  riskLevel: "Low Risk" | "Medium Risk" | "High Risk";
  details: {
    indicators: string[];
    recommendation: string;
  };
  creditsUsed: number;
  remainingCredits: number | "unlimited";
};

export default function AdvancedAIAnalysisPage() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResultType | null>(null);

  const reportRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  /* ======================
     RUN ANALYSIS
  ====================== */
  const runAnalysis = async () => {
    if (!text.trim()) {
      alert("Please paste a message, conversation, or scenario to analyze.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/advanced-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ text: text.trim() }),
      });

      if (res.status === 401) {
        router.push("/login");
        return;
      }

      if (res.status === 402) {
        router.push("/pricing");
        return;
      }

      if (!res.ok) {
        alert("Service temporarily unavailable.");
        return;
      }

      const data = await res.json();
      setResult(data);
      setText("");

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
    pdf.save("Trustverse_AI_Advanced_Analysis_Report.pdf");
  };

  /* ======================
     SHARE (WA + TG)
  ====================== */
  const shareReport = () => {
    if (!result) return;

    const textShare = `
Trustverse AI™ – Advanced Intelligence Report

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

  /* ======================
     REPORT AS SCAM
  ====================== */
  const reportAsScam = () => {
    if (!result) return;

    router.push(
      `/report-scam?source=advanced-ai&risk=${result.riskLevel}&score=${result.trustScore}`
    );
  };

  return (
    <div className="space-y-12 max-w-5xl">
      <CreditWarningBanner />

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">
          Trustverse AI™ Advanced AI Analysis{" "}
          <span className="text-orange-600">(PRO)</span>
        </h1>

        <p className="text-gray-600 mt-3 leading-relaxed max-w-4xl">
          This advanced AI-powered analysis engine evaluates messages,
          conversations, and real-world scenarios to identify scams, fraud
          attempts, manipulation tactics, and high-risk behavioral patterns.
        </p>

        <p className="text-gray-600 mt-2 leading-relaxed max-w-4xl">
          The system analyzes urgency signals, emotional manipulation, deceptive
          intent, impersonation attempts, and financial pressure to generate a
          clear and actionable risk assessment.
        </p>
      </div>

      {/* INPUT */}
      <div className="bg-white border rounded-xl p-6 space-y-4 max-w-3xl">
        <textarea
          rows={6}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste suspicious message, conversation, or scenario here..."
          className="w-full border rounded-md px-4 py-3 focus:ring-2 focus:ring-orange-500"
        />

        <button
          onClick={runAnalysis}
          disabled={loading}
          className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded disabled:opacity-60"
        >
          {loading ? "Analyzing..." : "Run AI Analysis"}
        </button>
      </div>

      {/* RESULT CARD */}
      {result && (
        <div
          ref={reportRef}
          className="bg-white border-2 border-orange-600 rounded-2xl p-6 max-w-3xl space-y-6 shadow-lg"
        >
          <p className="text-green-600 font-semibold text-sm">
            ✅ Analysis completed successfully
          </p>

          <h3 className="text-xl font-bold text-orange-700">
            Trustverse AI™ Advanced Intelligence Report
          </h3>

          <div className="text-center">
            <p className="text-sm text-gray-500">Trust Score</p>
            <p className="text-4xl font-extrabold text-orange-600">
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
              {result.details.indicators.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>

          <div className="bg-orange-50 border-l-4 border-orange-600 p-4 rounded">
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
              onClick={reportAsScam}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Report Scam
            </button>
          </div>

          <p className="text-sm text-center text-gray-500">
            Credits Used: <b>3</b> • Remaining:{" "}
            <b>
              {result.remainingCredits === "unlimited"
                ? "Unlimited (PRO)"
                : result.remainingCredits}
            </b>
          </p>
        </div>
      )}

      {/* LONG DESCRIPTION */}
      <div className="space-y-5 text-gray-700 max-w-4xl">
        <h2 className="text-xl font-semibold text-gray-900">
          How Trustverse AI™ Advanced Analysis Works
        </h2>

        <p>
          Trustverse AI™ Advanced Analysis uses behavioral intelligence,
          psychological pattern detection, and scam intelligence models to
          evaluate suspicious messages, conversations, and scenarios.
        </p>

        <p>
          This tool is particularly effective for identifying social engineering,
          impersonation, investment fraud, romance scams, and pressure-based
          manipulation tactics.
        </p>

        <ul className="list-disc pl-6 space-y-2">
          <li>Detect hidden manipulation and deception patterns</li>
          <li>Identify high-risk financial or emotional pressure tactics</li>
          <li>Assess real-world and online scam likelihood</li>
          <li>Support safer decision-making before engagement</li>
        </ul>

        <p className="text-sm text-gray-500">
          Automated AI analysis only. Always apply independent verification.
        </p>
      </div>

      {/* =========================
          FAQ SECTION (NEW)
      ========================= */}
      <div className="max-w-4xl space-y-6 border-t pt-10">
        <h2 className="text-2xl font-bold text-gray-900">
          Advanced AI Analysis – FAQs
        </h2>

        <div>
          <h3 className="font-semibold">
            What type of content can I analyze with this tool?
          </h3>
          <p className="text-sm text-gray-600">
            You can analyze messages, conversations, emails, investment offers,
            job proposals, romance chats, and real-world scenarios where fraud
            or manipulation is suspected.
          </p>
        </div>

        <div>
          <h3 className="font-semibold">
            How accurate is Trustverse AI Advanced Analysis?
          </h3>
          <p className="text-sm text-gray-600">
            The system uses multiple behavioral and scam intelligence models.
            While highly effective, results should be used as decision-support
            insights rather than absolute proof.
          </p>
        </div>

        <div>
          <h3 className="font-semibold">
            Can results vary for similar messages?
          </h3>
          <p className="text-sm text-gray-600">
            Yes. Slight variations in wording, context, and behavioral cues may
            result in different risk signals and trust scores.
          </p>
        </div>

        <div>
          <h3 className="font-semibold">
            Is this report legally binding?
          </h3>
          <p className="text-sm text-gray-600">
            No. Trustverse AI reports are informational and do not constitute
            legal, financial, or professional advice.
          </p>
        </div>
      </div>
    </div>
  );
}
