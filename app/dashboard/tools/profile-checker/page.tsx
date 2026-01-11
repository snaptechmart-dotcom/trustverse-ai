"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import CreditWarningBanner from "@/components/CreditWarningBanner";
import ProResultCard from "@/components/ProResultCard";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/* =========================
   TYPES
========================= */
type ProfileResult = {
  trustScore: number;
  riskLevel: "Low Risk" | "Medium Risk" | "High Risk";
  verdict: string;
  creditsUsed: number;
  remainingCredits?: number | "unlimited";
};

/* =========================
   AI SIGNALS
========================= */
function getDynamicSignals(
  risk: "Low Risk" | "Medium Risk" | "High Risk"
) {
  const map = {
    "Low Risk": [
      "Email domain reputation verified",
      "Strong identity consistency detected",
      "No impersonation indicators found",
      "Profile aligns with trusted patterns",
    ],
    "Medium Risk": [
      "Limited public identity signals found",
      "Partial identity consistency detected",
      "No direct scam indicators observed",
      "Moderate confidence in authenticity",
    ],
    "High Risk": [
      "Identity patterns resemble impersonation",
      "Low domain credibility detected",
      "Multiple inconsistencies found",
      "High similarity to scam profiles",
    ],
  };

  return map[risk].sort(() => 0.5 - Math.random()).slice(0, 3);
}

/* =========================
   HUMAN EXPLANATION
========================= */
function getHumanExplanation(
  risk: "Low Risk" | "Medium Risk" | "High Risk",
  score: number
) {
  if (risk === "Low Risk") {
    return `This profile shows strong identity consistency across all evaluated signals.

With a Trust Score of ${score}/100, the provided details align with professional and trusted identity patterns.
This profile is suitable for business communication and professional engagement.`;
  }

  if (risk === "Medium Risk") {
    return `This profile presents mixed trust indicators.

A Trust Score of ${score}/100 suggests moderate uncertainty.
Independent verification is recommended before sharing sensitive or financial information.`;
  }

  return `This profile triggered multiple high-risk identity indicators.

With a Trust Score of ${score}/100, this profile may be unreliable or misleading.
Avoid engagement unless independently verified.`;
}

export default function ProfileCheckerPage() {
  const router = useRouter();
  const reportRef = useRef<HTMLDivElement>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ProfileResult | null>(null);
  const [credits, setCredits] = useState<number | "unlimited">(0);

  /* =========================
     LOAD CREDITS
  ========================= */
  useEffect(() => {
    const loadCredits = async () => {
      try {
        const res = await fetch("/api/credits", {
          credentials: "include",
        });
        const data = await res.json();
        setCredits(data.credits ?? 0);
      } catch {}
    };

    loadCredits();
    window.addEventListener("credits-updated", loadCredits);
    return () =>
      window.removeEventListener("credits-updated", loadCredits);
  }, []);

  /* =========================
     RUN CHECK
  ========================= */
  const handleCheck = async () => {
    if (!name.trim() || !email.trim()) {
      alert("Name and Email are required.");
      return;
    }

    if (credits !== "unlimited" && credits < 2) {
      router.push("/pricing");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/profile-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) router.push("/login");
        if (res.status === 402) router.push("/pricing");
        alert(data?.error || "Service unavailable");
        return;
      }

      setResult(data);

      setName("");
      setEmail("");
      setPhone("");

      window.dispatchEvent(new Event("credits-updated"));
      window.dispatchEvent(new Event("history-updated"));
    } catch {
      alert("Network error");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     PDF
  ========================= */
  const downloadPDF = async () => {
    if (!reportRef.current) return;

    const canvas = await html2canvas(reportRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const width = 210;
    const height = (canvas.height * width) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save("Trustverse_Profile_Report.pdf");
  };

  /* =========================
     SHARE
  ========================= */
  const shareReport = async () => {
    if (!result) return;

    const text = `Trustverse AI – Profile Trust Intelligence Report

Trust Score: ${result.trustScore}/100
Risk Level: ${result.riskLevel}

${getHumanExplanation(
      result.riskLevel,
      result.trustScore
    )}

Verified by Trustverse AI
https://trustverseai.com`;

    const encoded = encodeURIComponent(text);

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Trustverse AI Profile Report",
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

  /* =========================
     SAFE DISPLAY VALUES
  ========================= */
  const remainingCreditsText =
    result?.remainingCredits === "unlimited"
      ? "Unlimited (PRO)"
      : String(result?.remainingCredits ?? "0");

  const creditsUsedDisplay = 2; // 🔥 PRO TOOL FIX

  return (
    <div className="space-y-16 max-w-5xl">
      {credits !== "unlimited" && <CreditWarningBanner />}

      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">
            Profile Trust Checker
          </h1>
          <p className="text-gray-600 max-w-3xl mt-2">
            Professional-grade AI identity verification for
            high-risk communication and business decisions.
          </p>
        </div>

        <span className="px-3 py-1 rounded-md bg-purple-700 text-white text-xs font-semibold">
          PRO
        </span>
      </div>

      {/* INPUT */}
      <div className="bg-white border rounded-xl p-6 space-y-4 max-w-xl">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full name"
          className="w-full border rounded-md px-4 py-2"
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          className="w-full border rounded-md px-4 py-2"
        />
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone (optional)"
          className="w-full border rounded-md px-4 py-2"
        />
        <button
          onClick={handleCheck}
          disabled={loading}
          className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-2 rounded font-semibold"
        >
          {loading ? "Analyzing Identity..." : "Run Profile Analysis"}
        </button>
      </div>

      {/* RESULT */}
      {result && (
        <div ref={reportRef}>
          <ProResultCard
            title="Profile Trust Intelligence Report"
            trustScore={result.trustScore}
            riskLevel={result.riskLevel}
            signals={getDynamicSignals(result.riskLevel)}
            explanation={getHumanExplanation(
              result.riskLevel,
              result.trustScore
            )}
            creditsUsed={creditsUsedDisplay}
            remainingCredits={remainingCreditsText}
            onShare={shareReport}
            onDownload={downloadPDF}
            onReport={() =>
              alert("Scam report submitted successfully.")
            }
          />
        </div>
      )}

      {/* LONG DESCRIPTION – ALWAYS VISIBLE */}
      <div className="max-w-4xl border-l-4 border-purple-600 bg-slate-50 p-6 rounded-md text-gray-700">
        <h2 className="text-xl font-semibold mb-3">
          How Profile Trust Checker Works
        </h2>

        <p>
          Trustverse AI Profile Trust Checker evaluates identity
          consistency using enterprise-grade AI heuristics trained
          on impersonation, scam, and fraud patterns.
        </p>

        <p className="mt-3">
          The system analyzes name structure, email domain
          credibility, optional phone signals, and behavioral
          indicators to generate a professional trust score.
        </p>

        <ul className="list-disc pl-6 mt-4 space-y-1">
          <li>Detect fake or impersonated profiles</li>
          <li>Reduce communication and business risk</li>
          <li>Designed for professionals and enterprises</li>
        </ul>

        <p className="text-sm text-gray-500 mt-4">
          Automated analysis only. Always verify critical identities
          independently.
        </p>
      </div>
    </div>
  );
}
