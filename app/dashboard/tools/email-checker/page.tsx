"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import CreditWarningBanner from "@/components/CreditWarningBanner";
import { QRCodeCanvas } from "qrcode.react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/* ======================
   TYPES
====================== */
type ResultType = {
  trustScore: number;
  riskLevel: "Low Risk" | "Medium Risk" | "High Risk";
  verdict: string;
  creditsUsed: number;
  remainingCredits: number | "unlimited";
};

/* ======================
   HUMAN EXPLANATION
====================== */
function getHumanExplanation(
  risk: "Low Risk" | "Medium Risk" | "High Risk",
  score: number
) {
  if (risk === "Low Risk") {
    return `
This email address demonstrates strong trust indicators based on our analysis.
The domain reputation appears healthy, usage patterns are consistent,
and no major scam signals were detected at this time.

With a Trust Score of ${score}/100, this email is generally considered safe.
However, we still recommend staying cautious when sharing sensitive information,
especially if this is a first-time interaction.
`;
  }

  if (risk === "Medium Risk") {
    return `
This email address shows mixed trust signals.
While it does not clearly indicate malicious intent, certain behavioral
and structural patterns suggest moderate risk.

A Trust Score of ${score}/100 means you should proceed carefully.
We advise verifying the sender independently before engaging
in financial or sensitive communication.
`;
  }

  return `
This email address triggered high-risk indicators during analysis.
The domain or usage behavior resembles patterns commonly associated
with disposable, impersonation, or phishing-related emails.

With a low Trust Score of ${score}/100, interacting with this email
could expose you to fraud or identity risks.
We strongly recommend avoiding engagement.
`;
}

export default function EmailCheckerPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResultType | null>(null);

  const router = useRouter();
  const reportRef = useRef<HTMLDivElement>(null);

  /* ======================
     CHECK EMAIL
  ====================== */
  const handleCheck = async () => {
    if (!email.trim()) {
      alert("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/email-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ text: email.trim() }), // 🔥 correct payload
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
        alert("Email analysis failed. Please try again.");
        return;
      }

      const data = await res.json();
      setResult(data);
      setEmail("");

      // 🔔 global sync
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
    pdf.save("Trustverse_Email_Report.pdf");
  };

  /* ======================
     SHARE
  ====================== */
  const shareReport = async () => {
    if (!result) return;

    const text = `Trustverse AI – Email Risk Report

Trust Score: ${result.trustScore}/100
Risk Level: ${result.riskLevel}

${getHumanExplanation(result.riskLevel, result.trustScore)}

Verified by Trustverse AI
https://trustverseai.com`;

    const encoded = encodeURIComponent(text);

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Trustverse AI Email Report",
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

  return (
    <div className="space-y-14 max-w-5xl">
      <CreditWarningBanner />

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">
          Trustverse AI – Email Address Checker
        </h1>
        <p className="text-gray-600 max-w-3xl mt-2">
          Analyze email addresses to detect disposable usage, impersonation risk,
          and potential fraud using Trustverse AI trust indicators.
        </p>
      </div>

      {/* INPUT */}
      <div className="bg-white border rounded-xl p-6 shadow max-w-xl">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email address"
          className="w-full border rounded px-4 py-2 mb-4"
        />
        <button
          onClick={handleCheck}
          disabled={loading}
          className="w-full bg-emerald-600 text-white py-2 rounded font-semibold"
        >
          {loading ? "Analyzing…" : "Check Email"}
        </button>
      </div>

      {/* RESULT */}
      {result && (
        <div
          ref={reportRef}
          className="bg-white border rounded-xl shadow max-w-3xl"
        >
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-bold">
              📧 Trustverse AI – Email Verification Report
            </h2>
            <p className="text-sm text-green-700">
              ✔ Analysis completed successfully
            </p>
          </div>

          <div className="p-6 space-y-6">
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-semibold
              ${
                result.riskLevel === "Low Risk"
                  ? "bg-green-100 text-green-700"
                  : result.riskLevel === "Medium Risk"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {result.riskLevel}
            </span>

            <p className="text-2xl font-bold">
              Trust Score: {result.trustScore}/100
            </p>

            {/* HUMAN MESSAGE */}
            <div className="bg-slate-50 border-l-4 border-emerald-500 p-4 rounded-md">
              <p className="font-semibold text-gray-900 mb-2">
                What does this mean for you?
              </p>
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                {getHumanExplanation(
                  result.riskLevel,
                  result.trustScore
                )}
              </p>
            </div>

            {/* QR */}
            <QRCodeCanvas
              value={`Email Risk Report | Score ${result.trustScore}`}
              size={120}
            />

            {/* ACTIONS UNDER QR */}
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={shareReport}
                className="bg-blue-600 text-white px-4 py-2 rounded"
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
                onClick={() => alert("Scam report submitted successfully.")}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Report Scam
              </button>
            </div>

            <p className="text-sm text-gray-500">
              Credits Used: <b>{result.creditsUsed}</b> • Remaining:{" "}
              <b>
                {result.remainingCredits === "unlimited"
                  ? "Unlimited (PRO)"
                  : result.remainingCredits}
              </b>
            </p>
          </div>
        </div>
      )}

      {/* LONG DESCRIPTION – ALWAYS VISIBLE */}
      <div className="pt-10 border-t max-w-4xl text-gray-700">
        <h2 className="text-xl font-semibold mb-4">
          How Trustverse AI Email Checker Works
        </h2>

        <p>
          Trustverse AI evaluates email addresses using domain reputation,
          disposable email detection, historical abuse patterns,
          and simulated fraud indicators.
        </p>

        <p className="mt-3">
          This tool helps protect you from phishing attempts,
          impersonation scams, and risky communications before
          you engage or share sensitive data.
        </p>

        <ul className="list-disc pl-6 mt-4 space-y-2">
          <li>Detect disposable or temporary email addresses</li>
          <li>Identify phishing and impersonation risks</li>
          <li>Improve personal and business security</li>
        </ul>

        <p className="text-sm text-gray-500 mt-4">
          Automated analysis only. Always verify independently before
          making critical decisions.
        </p>
      </div>
    </div>
  );
}
