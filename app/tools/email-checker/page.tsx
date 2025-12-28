"use client";

import { useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import CreditWarningBanner from "@/components/CreditWarningBanner";

type EmailResult = {
  email: string;
  trustScore: number;
  riskLevel: "Low Risk" | "Medium Risk" | "High Risk";
  description: string;
  longDescription: string;
};

export default function EmailCheckerPage() {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<EmailResult | null>(null);
  const [loading, setLoading] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const checkEmail = async () => {
    if (!email) return alert("Enter email");

    setLoading(true);

    try {
      const res = await fetch("/api/email-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      setResult({
        email: data.email,
        trustScore: data.trustScore,
        riskLevel: data.riskLevel,
        description: data.description,
        longDescription:
          data.longDescription ||
          "Multiple trust and risk indicators were analyzed for this email address, including provider reputation, disposable email usage, and known scam behavior patterns. A higher trust score suggests the email is more likely to be legitimate, while a lower score may indicate phishing, fraud, or spam activity. Avoid interacting with high-risk email addresses unless independently verified.",
      });
    } catch {
      alert("Failed to check email");
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    if (!resultRef.current) return;
    const canvas = await html2canvas(resultRef.current);
    const img = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    pdf.addImage(img, "PNG", 0, 0, 210, 0);
    pdf.save("trustverse-email-report.pdf");
  };

  return (
    <div className="p-6">
      {/* INPUT – hidden after result */}
      {!result && (
        <div className="max-w-xl">
          <h1 className="text-2xl font-bold mb-2">Email Checker</h1>
          <p className="text-gray-500 mb-4">
            Analyze an email address for potential risk.
          </p>

          <CreditWarningBanner />

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email address"
            className="w-full border p-3 rounded mb-3"
          />

          <button
            onClick={checkEmail}
            disabled={loading}
            className="bg-black text-white px-6 py-2 rounded"
          >
            {loading ? "Checking..." : "Check Email"}
          </button>
        </div>
      )}

      {/* RESULT – ADVANCED ANALYSIS STYLE */}
      {result && (
        <div
          ref={resultRef}
          className="max-w-3xl bg-white rounded-xl shadow p-8"
        >
          <h2 className="text-xl font-semibold mb-3">
            Trustverse AI Email Analysis Report
          </h2>

          <p className="mb-1">
            <b>Status:</b> Completed ✅
          </p>

          <p className="mb-2">
            <b>Risk Level:</b>{" "}
            <span className="font-semibold">{result.riskLevel}</span>
          </p>

          <p className="text-gray-700 mb-4">
            {result.longDescription}
          </p>

          <p className="text-sm text-gray-500 mb-4">
            Credits Used: 1
          </p>

          <h3 className="font-semibold mb-2">Share This Report</h3>
          <QRCodeCanvas value={result.email} size={120} />

          <div className="flex gap-4 mt-6">
            <button
              onClick={downloadPDF}
              className="border px-4 py-2 rounded"
            >
              Download PDF
            </button>

            <button className="text-red-600">
              Report as Scam
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
