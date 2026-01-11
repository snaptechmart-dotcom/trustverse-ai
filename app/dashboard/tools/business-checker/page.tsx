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
  const [reporting, setReporting] = useState(false);

  /* =========================
     CHECK BUSINESS
  ========================= */
  const checkBusiness = async () => {
    if (!businessName.trim() || !domain.trim()) {
      alert("Business name and domain are required");
      return;
    }

    const res = await fetch("/api/business-check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ businessName, domain }),
    });

    if (!res.ok) {
      alert("Service temporarily unavailable");
      return;
    }

    const data = await res.json();
    setResult(data);

    setBusinessName("");
    setDomain("");

    const qrText = `
Trustverse AI – Business Trust Intelligence Report

Business: ${data.businessName}
Domain: ${data.domain}
Trust Score: ${data.trustScore}/100
Risk Level: ${data.riskLevel}
`;
    setQr(await QRCode.toDataURL(qrText));

    window.dispatchEvent(new Event("credits-updated"));
  };

  /* =========================
     SHARE
  ========================= */
  const shareReport = () => {
    if (!result) return;

    const text = `
Trustverse AI – Business Trust Intelligence Report

Business: ${result.businessName}
Domain: ${result.domain}
Trust Score: ${result.trustScore}/100
Risk Level: ${result.riskLevel}

${result.details?.recommendation}

https://trustverseai.com
    `.trim();

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encoded}`, "_blank");
    window.open(
      `https://t.me/share/url?url=https://trustverseai.com&text=${encoded}`,
      "_blank"
    );
  };

  /* =========================
     PDF
  ========================= */
  const downloadPDF = () => {
    if (!result) return;

    const pdf = new jsPDF();
    pdf.setFontSize(14);
    pdf.text("Trustverse AI – Business Trust Intelligence Report", 10, 15);

    pdf.setFontSize(11);
    pdf.text(`Business: ${result.businessName}`, 10, 30);
    pdf.text(`Domain: ${result.domain}`, 10, 40);
    pdf.text(`Trust Score: ${result.trustScore}/100`, 10, 50);
    pdf.text(`Risk Level: ${result.riskLevel}`, 10, 60);

    pdf.text("Detailed AI Analysis:", 10, 75);
    pdf.text(
      result.details?.longReport ||
        "This report is generated using Trustverse AI proprietary risk intelligence models.",
      10,
      85,
      { maxWidth: 180 }
    );

    pdf.save("trustverse-business-report.pdf");
  };

  /* =========================
     REPORT SCAM
  ========================= */
  const reportScam = async () => {
    if (!result || reporting) return;

    setReporting(true);
    try {
      await fetch("/api/report-scam", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: result.businessName,
          domain: result.domain,
          trustScore: result.trustScore,
          riskLevel: result.riskLevel,
        }),
      });

      alert(
        "Thank you. This business has been submitted for expert manual verification by the Trustverse AI team."
      );
    } catch {
      alert("Unable to submit report right now.");
    } finally {
      setReporting(false);
    }
  };

  return (
    <div className="space-y-10 max-w-5xl">
      <CreditWarningBanner />

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Business / Domain Trust Checker
          </h1>
          <p className="text-gray-600 max-w-3xl mt-2">
            Professional-grade AI analysis to evaluate business and website
            trustworthiness before payments, partnerships, or data sharing.
          </p>
        </div>

        <span className="px-3 py-1 text-xs rounded-md bg-purple-700 text-white font-semibold">
          PRO
        </span>
      </div>

      {/* INPUT TOOL */}
      <div className="bg-white border rounded-xl p-6 space-y-4 max-w-xl">
        <input
          className="w-full border rounded px-4 py-2"
          placeholder="Business name"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
        />
        <input
          className="w-full border rounded px-4 py-2"
          placeholder="Domain (example.com)"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
        />
        <button
          onClick={checkBusiness}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded font-semibold"
        >
          Analyze Business
        </button>
      </div>

      {/* 🔥 TOOL KE NEECHÉ LONG DESCRIPTION (FINAL FIX) */}
      <div className="max-w-xl bg-slate-50 border rounded-xl p-6 space-y-3">
        <h3 className="text-lg font-bold text-purple-700">
          How Trustverse AI Evaluates Business Trust
        </h3>

        <p className="text-sm text-gray-700">
          This tool uses Trustverse AI’s advanced risk intelligence engine to
          analyze online businesses and domains before you engage in payments,
          partnerships, or data sharing.
        </p>

        <p className="text-sm text-gray-700">
          Our system evaluates multiple trust factors including domain age,
          behavioral patterns, reputation signals, scam similarity models, and
          historical risk indicators collected from large-scale intelligence
          sources.
        </p>

        <p className="text-sm font-semibold text-black">
          Why this matters: Many online scams look legitimate at first glance.
          This analysis helps you identify hidden risks before it’s too late.
        </p>

        <p className="text-xs text-gray-500">
          This is a premium Trustverse AI™ trust intelligence tool.
        </p>
      </div>

      {/* =========================
          RESULT CARD (UNCHANGED)
      ========================= */}
      {result && (
        <>
          <div className="bg-white border-2 border-purple-600 rounded-2xl p-6 max-w-xl space-y-6 shadow-lg">
            <p className="text-green-600 font-semibold text-sm">
              ✅ Analysis completed successfully
            </p>

            <h3 className="text-xl font-bold text-purple-700">
              🏢 Business Trust Intelligence Report
            </h3>

            <div className="text-center">
              <p className="text-sm text-gray-500">Trust Score</p>
              <p className="text-4xl font-extrabold text-purple-700">
                {result.trustScore}
                <span className="text-base text-gray-500"> /100</span>
              </p>
            </div>

            <div className="flex justify-center">
              <span className="px-4 py-1 rounded-full text-sm font-bold bg-yellow-100 text-yellow-700">
                {result.riskLevel}
              </span>
            </div>

            {/* AI SIGNALS */}
            <div className="bg-slate-50 border rounded p-4">
              <p className="font-semibold mb-2">
                🔍 AI Risk Signals Detected
              </p>
              <ul className="list-disc pl-5 text-sm space-y-1">
                {(result.details?.indicators?.length
                  ? result.details.indicators
                  : ["No strong negative indicators detected."]
                ).map((s: string, i: number) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>

            {/* HUMAN EXPLANATION */}
            <div className="bg-purple-50 border-l-4 border-purple-600 p-4 rounded">
              <p className="font-semibold mb-2">
                What does this mean for you?
              </p>
              <p className="text-sm text-gray-700">
                This analysis suggests a{" "}
                <b>{result.riskLevel.toLowerCase()}</b> profile. While no critical
                scam indicators were detected, users should remain cautious
                during high-value transactions.
              </p>
            </div>

            {qr && (
              <div className="flex justify-center">
                <img src={qr} className="w-28" />
              </div>
            )}

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
                onClick={reportScam}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Report Scam
              </button>
            </div>

            <p className="text-sm text-center text-gray-500">
              Credits Used: <b>{result.creditsUsed}</b> • Remaining:{" "}
              <b>{result.remainingCredits}</b>
            </p>
          </div>
        </>
      )}
    </div>
  );
}
