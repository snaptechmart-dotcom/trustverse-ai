"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { QRCodeCanvas } from "qrcode.react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import CreditWarningBanner from "@/components/CreditWarningBanner";

type ResultType = {
  riskLevel: "Low Risk" | "Medium Risk" | "High Risk";
  explanation: string;
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
      alert("Please paste a message or scenario to analyze.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/advanced-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.trim() }),
      });

      if (res.status === 401) {
        alert("Session expired. Please login again.");
        router.push("/login");
        return;
      }

      if (res.status === 402) {
        alert("No credits left. Please upgrade to Pro.");
        router.push("/pricing");
        return;
      }

      if (!res.ok) {
        alert("Service temporarily unavailable. Please try again.");
        return;
      }

      const data: ResultType = await res.json();
      setResult(data);
      setText("");

      window.dispatchEvent(new Event("credits-updated"));
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
     REPORT AS SCAM (FIXED)
  ====================== */
  const reportAsScam = async () => {
    if (!result) return;

    const confirmReport = window.confirm(
      "Do you want to report this analysis as a potential scam case?"
    );
    if (!confirmReport) return;

    try {
      const res = await fetch("/api/report-scam", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tool: "Advanced AI Analysis",
          content: result.explanation,
          riskLevel: result.riskLevel,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data?.error || "Failed to submit report.");
        return;
      }

      alert("🚨 Scam report submitted successfully. Our team will review it.");
    } catch {
      alert("Network error while reporting.");
    }
  };

  return (
    <div className="space-y-12 max-w-4xl">
      <CreditWarningBanner />

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Advanced AI Analysis</h1>

        <p className="text-gray-600 mt-3 leading-relaxed">
          This advanced AI-powered analysis tool helps you identify potential
          scams, fraud attempts, manipulation tactics, and high-risk behavioral
          patterns hidden inside messages, conversations, or real-world
          scenarios.
        </p>

        <p className="text-gray-600 mt-3 leading-relaxed">
          The system evaluates urgency signals, emotional manipulation, deceptive
          intent, and financial pressure to generate a clear risk assessment.
          This report is designed as a decision-support tool and should not be
          considered legal or financial advice.
        </p>
      </div>

      {/* INPUT */}
      <div className="bg-white border rounded-xl p-6 space-y-4 max-w-2xl">
        <textarea
          rows={5}
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

      {/* RESULT */}
      {result && (
        <div
          ref={reportRef}
          className="bg-white border rounded-xl p-6 space-y-4 max-w-2xl"
        >
          <h3 className="text-xl font-semibold">
            🧠 Trustverse AI Advanced Analysis Report
          </h3>

          <p>
            <strong>Status:</strong>{" "}
            <span className="text-emerald-600 font-semibold">
              Completed ✅
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

          <p className="text-gray-700 leading-relaxed">
            {result.explanation}
          </p>

          <div className="text-sm text-gray-600 pt-2">
            <p>
              <strong>Credits Used:</strong> 1
            </p>
            <p>
              <strong>Available Credits:</strong>{" "}
              {result.remainingCredits === "unlimited"
                ? "Unlimited"
                : result.remainingCredits}
            </p>
          </div>

          {/* QR CODE */}
          <div className="pt-4">
            <p className="font-medium mb-2">
              Share or verify this report using QR code
            </p>
            <QRCodeCanvas
              value={window.location.href}
              size={120}
              bgColor="#ffffff"
              fgColor="#000000"
            />
          </div>
        </div>
      )}

      {/* ACTION BUTTONS */}
      {result && (
        <div className="flex gap-4">
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
      )}
    </div>
  );
}
