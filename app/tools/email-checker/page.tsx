"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { QRCodeCanvas } from "qrcode.react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import CreditWarningBanner from "@/components/CreditWarningBanner";

type EmailResult = {
  email: string;
  risk: "Low Risk" | "Medium Risk" | "High Risk";
  remainingCredits: number | "unlimited";
};

export default function EmailCheckerPage() {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<EmailResult | null>(null);
  const [loading, setLoading] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const checkEmail = async () => {
    if (!email.trim()) {
      alert("Please enter an email address");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/email-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      // 🔐 Auth / credit handling
      if (res.status === 401) {
        router.push("/login");
        return;
      }

      if (res.status === 402) {
        router.push("/pricing");
        return;
      }

      if (!res.ok) {
        throw new Error("API failed");
      }

      const data = await res.json();

      // ✅ EXACT API RESPONSE MATCH
      setResult({
        email: data.email,
        risk: data.risk,
        remainingCredits: data.remainingCredits,
      });

      // ✅ INPUT CLEAR GUARANTEED
      setEmail("");
      window.dispatchEvent(new Event("credits-updated"));
    } catch (error) {
      console.error("EMAIL CHECK ERROR:", error);
      alert("Service temporarily unavailable. Please try again.");
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

  return (
    <div className="max-w-4xl p-6 space-y-10">
      <CreditWarningBanner />

      {/* INPUT SECTION */}
      {!result && (
        <div className="max-w-xl space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">
            Email Address Checker
          </h1>

          <p className="text-gray-500">
            Verify email addresses to identify risky, disposable, or suspicious
            emails.
          </p>

          <input
            key={result ? "cleared" : "active"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email address"
            className="w-full border p-3 rounded"
          />

          <button
            onClick={checkEmail}
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded"
          >
            {loading ? "Checking..." : "Check Email"}
          </button>
        </div>
      )}

      {/* RESULT SECTION */}
      {result && (
        <div
          ref={reportRef}
          className="bg-white border rounded-xl p-8 space-y-6"
        >
          <h2 className="text-xl font-semibold">
            📧 Trustverse AI Email Verification Report
          </h2>

          <p>
            <strong>Status:</strong>{" "}
            <span className="text-emerald-600 font-semibold">
              Completed ✅
            </span>
          </p>

          <p>
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

          {/* LONG DESCRIPTION */}
          <div className="bg-slate-50 border-l-4 border-emerald-500 p-6 rounded">
            <h4 className="font-semibold mb-2">
              Detailed Risk Analysis
            </h4>
            <p className="text-gray-700 leading-relaxed">
              This email address was analyzed using Trustverse AI’s automated
              risk-assessment engine. Multiple indicators including provider
              reputation, disposable email usage, and historical scam patterns
              were evaluated to determine its trustworthiness.
            </p>
          </div>

          <p className="text-sm text-gray-500">
            Remaining Credits:{" "}
            {result.remainingCredits === "unlimited"
              ? "Unlimited"
              : result.remainingCredits}
          </p>

          <div>
            <p className="font-medium mb-2">Share This Report</p>
            <QRCodeCanvas value={result.email} size={120} />
          </div>

          <div className="flex gap-4">
            <button
              onClick={downloadPDF}
              className="bg-emerald-600 text-white px-4 py-2 rounded"
            >
              Download PDF
            </button>

            <button
              onClick={() =>
                router.push(
                  `/report-scam?source=email&risk=${result.risk}`
                )
              }
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Report as Scam
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
