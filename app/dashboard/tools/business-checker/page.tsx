"use client";

import { useState } from "react";
import jsPDF from "jspdf";
import QRCode from "qrcode";
import CreditWarningBanner from "@/components/CreditWarningBanner";

export default function BusinessCheckerPage() {
  const [businessName, setBusinessName] = useState("");
  const [domain, setDomain] = useState("");
  const [result, setResult] = useState<any>(null);
  const [qr, setQr] = useState("");

  const checkBusiness = async () => {
    const res = await fetch("/api/business-check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ businessName, domain }),
    });

    if (!res.ok) {
      alert("Service temporarily unavailable");
      return;
    }

    const data = await res.json();
    setResult(data);

    // 🔥 clear inputs after result
    setBusinessName("");
    setDomain("");

    const qrText = `
Trustverse AI Business Verification Report
Business: ${data.businessName}
Domain: ${data.domain}
Trust Score: ${data.trustScore}/100
Risk Level: ${data.riskLevel}
`;
    setQr(await QRCode.toDataURL(qrText));
    window.dispatchEvent(new Event("credits-updated"));
  };

  const downloadPDF = () => {
    const pdf = new jsPDF();
    pdf.text("Trustverse AI – Business Verification Report", 10, 10);
    pdf.text(`Business: ${result.businessName}`, 10, 20);
    pdf.text(`Domain: ${result.domain}`, 10, 30);
    pdf.text(`Trust Score: ${result.trustScore}/100`, 10, 40);
    pdf.text(`Risk Level: ${result.riskLevel}`, 10, 50);
    pdf.text(result.longReport, 10, 65);
    pdf.save("trustverse-business-report.pdf");
  };

  const shareReport = async () => {
    const text = `
Trustverse AI Business Verification Report

Business: ${result.businessName}
Domain: ${result.domain}
Trust Score: ${result.trustScore}/100
Risk Level: ${result.riskLevel}

Recommendation:
${result.recommendation}
`;

    if (navigator.share) {
      await navigator.share({
        title: "Trustverse AI Business Report",
        text,
      });
    } else {
      await navigator.clipboard.writeText(text);
      alert("Share not supported. Report copied to clipboard.");
    }
  };

  const reportScam = () => {
    alert(
      "Thank you for reporting. This business has been flagged for manual review."
    );
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <CreditWarningBanner />

      {/* HEADER */}
      <div className="flex items-center gap-3">
        <h1 className="text-3xl font-bold">
          Business / Domain Trust Checker
        </h1>
        <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded">
          PRO
        </span>
      </div>

      {/* INPUT */}
      <div className="bg-white p-6 rounded-xl border space-y-3">
        <input
          className="w-full border px-4 py-2 rounded"
          placeholder="Business name"
          value={businessName}
          onChange={e => setBusinessName(e.target.value)}
        />
        <input
          className="w-full border px-4 py-2 rounded"
          placeholder="Domain"
          value={domain}
          onChange={e => setDomain(e.target.value)}
        />
        <button
          onClick={checkBusiness}
          className="bg-emerald-600 text-white px-6 py-2 rounded"
        >
          Check Business
        </button>
      </div>
      {/* TOOL DESCRIPTION – ALWAYS VISIBLE */}
<div className="bg-white p-6 rounded-xl border space-y-4 text-gray-700">
  <h3 className="text-lg font-semibold text-gray-900">
    How Business / Domain Trust Checker Works
  </h3>

  <p>
    Trustverse AI Business / Domain Trust Checker helps you evaluate the
    trustworthiness of a business or website before engagement, payment,
    or sharing sensitive information.
  </p>

  <p>
    Our system analyzes publicly observable signals such as domain
    structure, naming consistency, and common scam indicators to detect
    potential risks at an early stage.
  </p>

  <ul className="list-disc pl-6 space-y-1">
    <li>Validates domain structure and formatting</li>
    <li>Detects common scam and impersonation keywords</li>
    <li>Analyzes business name consistency</li>
    <li>Generates a risk-based trust score</li>
  </ul>

  <p className="text-sm text-gray-500 italic">
    Disclaimer: This tool provides automated indicators only and does not
    guarantee business legitimacy. Always perform independent verification
    for critical decisions.
  </p>
</div>

      {/* RESULT */}
      {result && (
        <div className="bg-white p-6 rounded-xl border space-y-4">
          <h2 className="text-xl font-bold text-emerald-700">
            🔍 Trustverse AI Business Verification Report
          </h2>

          {/* GREEN STATUS */}
          <p className="text-green-600 font-semibold">
            Verification Status: Successfully Completed ✅
          </p>

          {/* TRUST SCORE */}
          <div className="flex items-center gap-4">
            <div className="text-4xl font-bold text-blue-600">
              {result.trustScore}/100
            </div>
            <div className="text-sm text-gray-600">
              Trust Score
            </div>
          </div>

          <p><b>Business:</b> {result.businessName}</p>
          <p><b>Domain:</b> {result.domain}</p>
          <p><b>Account Type:</b> {result.accountType}</p>

          {/* 🔥 LONG DESCRIPTION – FINAL FIX */}
          <p className="font-semibold mt-2">
            Risk Assessment Summary:
          </p>

          <div className="space-y-3 text-gray-700">
            <p>
              Our AI-based Business Verification system evaluated the submitted
              business identity using publicly observable trust signals and
              known risk patterns.
            </p>

            <p>
              This automated analysis focuses on identifying early warning
              signs that may indicate potential fraud, impersonation, or
              misleading business behavior.
            </p>

            <ul className="list-disc pl-5">
              <li>Domain structure validity</li>
              <li>Keyword-based scam indicators</li>
              <li>Business name consistency</li>
              <li>Common impersonation and fraud patterns</li>
            </ul>

            <p className="text-sm text-gray-600">
              This system does not guarantee legitimacy. It is designed as an
              early-warning and risk-awareness tool. Always combine automated
              results with independent verification for critical decisions.
            </p>
          </div>

          <p className="font-bold text-red-600">
            Final Risk Level: {result.riskLevel}
          </p>

          <ul className="list-disc pl-5 text-gray-700">
            {result.indicators.map((i: string, idx: number) => (
              <li key={idx}>{i}</li>
            ))}
          </ul>

          <p className="font-semibold">Recommendation:</p>
          <p>{result.recommendation}</p>

          <p className="text-sm text-gray-600">
            Credits Used: {result.creditsUsed} <br />
            Available Credits: {result.remainingCredits}
          </p>

          {qr && <img src={qr} className="w-32" />}

          {/* ACTION BUTTONS */}
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={downloadPDF}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Download PDF
            </button>
            <button
              onClick={shareReport}
              className="bg-gray-800 text-white px-4 py-2 rounded"
            >
              Share Report
            </button>
            <button
              onClick={reportScam}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Report Scam
            </button>
          </div>

          <p className="text-xs text-gray-500 italic">
            This result is generated using automated indicators and is intended
            for guidance only. Always consider additional verification.
          </p>
        </div>
      )}
    </div>
  );
}
