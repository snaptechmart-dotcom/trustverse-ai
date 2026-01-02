"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import CreditWarningBanner from "@/components/CreditWarningBanner";
import { QRCodeCanvas } from "qrcode.react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

type ResultType = {
  status: string;
  email: string;
  risk: "Low Risk" | "Medium Risk" | "High Risk";
  remainingCredits: number | "unlimited";
};

export default function EmailCheckerPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResultType | null>(null);

  const router = useRouter();
  const reportRef = useRef<HTMLDivElement>(null);

  const handleCheck = async () => {
    if (!email.trim()) {
      alert("Please enter an email address.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/email-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
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

      const data: ResultType = await res.json();
      setResult(data);
      setEmail(""); // sirf text clear

      // 🔥 UPDATE CREDITS + HISTORY (FINAL)
      window.dispatchEvent(new Event("credits-updated"));
      window.dispatchEvent(new Event("history-updated")); // ✅ ADD THIS

    } catch {
      alert("Network error.");
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    if (!reportRef.current) return;

    const canvas = await html2canvas(reportRef.current);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = 210;
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("trustverse-email-report.pdf");
  };

  const reportScam = async () => {
    if (!result) return;

    await fetch("/api/report-scam", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "EMAIL",
        value: result.email,
        reason: result.risk,
        impact: -10,
      }),
    });

    alert("Email reported successfully.");
  };

  return (
    <div className="space-y-10 max-w-4xl">
      <CreditWarningBanner />

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Email Address Checker
        </h1>
        <p className="text-gray-500 mt-2 max-w-3xl">
          Verify email addresses to identify risky, disposable, or suspicious
          emails using automated Trustverse AI risk indicators.
        </p>
      </div>

      {/* INPUT — ALWAYS VISIBLE */}
      <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4 max-w-xl">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email address (e.g. user@example.com)"
          className="w-full bg-slate-50 border border-slate-300 rounded-md px-4 py-2
          focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />

        <button
          onClick={handleCheck}
          disabled={loading}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-md"
        >
          {loading ? "Checking..." : "Check Email"}
        </button>
      </div>

      {/* RESULT */}
      {result && (
        <div
          ref={reportRef}
          className="bg-white border rounded-xl p-8 max-w-3xl space-y-6"
        >
          <h3 className="text-xl font-semibold text-gray-900">
            📧 Trustverse AI Email Verification Report
          </h3>

          <p>
            <strong>Status:</strong>{" "}
            <span className="text-emerald-600 font-semibold">
              Completed ✅
            </span>
          </p>

          <p className="text-sm text-gray-700">
            <strong>Email Checked:</strong> {result.email}
          </p>

          <p>
            <strong>Final Risk Level:</strong>{" "}
            <span
              className={
                result.risk === "Low Risk"
                  ? "text-green-600 font-bold"
                  : result.risk === "Medium Risk"
                  ? "text-yellow-600 font-bold"
                  : "text-red-600 font-bold"
              }
            >
              {result.risk}
            </span>
          </p>

          {/* ACTION BUTTONS */}
          <div className="flex gap-4">
            <button
              onClick={downloadPDF}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md"
            >
              Download PDF
            </button>

            <button
              onClick={reportScam}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
            >
              Report as Scam
            </button>
          </div>

          {/* CREDITS INFO — FIXED & VISIBLE */}
          <div className="border-t pt-4 text-sm text-gray-600 space-y-1">
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
            <p className="font-medium text-gray-800 mb-2">
              Share This Report
            </p>
            <QRCodeCanvas value={result.email} size={120} />
          </div>
        </div>
      )}

      {/* LONG DESCRIPTION — ALWAYS VISIBLE */}
      <div className="max-w-4xl bg-slate-50 border-l-4 border-emerald-500 p-6 rounded-md">
        <h4 className="text-xl font-semibold text-gray-900 mb-3">
          Detailed Risk Analysis
        </h4>

        <div className="space-y-3 text-gray-700 leading-relaxed">
          <p>
            This email address was analyzed using Trustverse AI’s automated
            risk-assessment engine. The system evaluated domain reputation,
            disposable email usage, structural email patterns, and historical
            scam behavior.
          </p>

          <p>
            A <strong>{result?.risk ?? "risk"}</strong> classification indicates
            the probability that this email address could be associated with
            phishing attempts, impersonation, spam campaigns, or fraud-related
            activity.
          </p>

          <p>
            We strongly recommend verifying the sender independently before
            engaging in sensitive communication or sharing personal or financial
            information.
          </p>
        </div>
      </div>
    </div>
  );
}
