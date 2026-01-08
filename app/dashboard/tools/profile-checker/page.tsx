"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { QRCodeCanvas } from "qrcode.react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import CreditWarningBanner from "@/components/CreditWarningBanner";

/* =========================
   TYPES
========================= */
type ProfileResult = {
  trustScore: number;
  risk: "Low Risk" | "Medium Risk" | "High Risk";
  reason: string;
  advice: string;
  remainingCredits?: number | "unlimited";
  share?: {
    title: string;
    text: string;
  };
};

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
     FETCH CREDITS
  ========================= */
  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const res = await fetch("/api/credits", { credentials: "include" });
        if (!res.ok) return;
        const data = await res.json();
        setCredits(data.credits ?? 0);
      } catch {}
    };

    fetchCredits();
    window.addEventListener("credits-updated", fetchCredits);
    return () => window.removeEventListener("credits-updated", fetchCredits);
  }, []);

  /* =========================
     COPY TO CLIPBOARD (SAFE)
  ========================= */
  const copyToClipboard = async (text: string) => {
    if (typeof window === "undefined") return;

    try {
      if (
        "clipboard" in navigator &&
        typeof navigator.clipboard.writeText === "function"
      ) {
        await navigator.clipboard.writeText(text);
        alert("Report copied to clipboard");
        return;
      }
    } catch {}

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    alert("Report copied to clipboard");
  };

  /* =========================
     HANDLE CHECK
  ========================= */
  const handleCheck = async () => {
    if (!name.trim() || !email.trim()) {
      alert("Name and Email are required.");
      return;
    }

    if (credits !== "unlimited" && credits <= 0) {
      alert("No credits left. Please upgrade to Pro.");
      router.push("/pricing");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/tools/profile", {
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
        if (res.status === 403) router.push("/pricing");
        alert(data?.error || "Service temporarily unavailable");
        return;
      }

      setResult({
        ...data,
        share: {
          title: "Trustverse AI – Profile Trust Report",
          text: `Profile Trust Report\nTrust Score: ${data.trustScore}/100\nRisk Level: ${data.risk}\nAdvice: ${data.advice}`,
        },
      });

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
     DOWNLOAD PDF
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
     REPORT AS SCAM
  ========================= */
  const reportAsScam = () => {
    if (!result) return;
    router.push(
      `/report-scam?source=profile-checker&risk=${result.risk}&score=${result.trustScore}`
    );
  };

  return (
    <div className="space-y-12 max-w-4xl">
      {credits !== "unlimited" && <CreditWarningBanner />}

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">
          Profile Trust Checker <span className="text-purple-600">(PRO)</span>
        </h1>
        <p className="text-gray-500 mt-2 max-w-3xl">
          Analyze profile identity signals such as name, email, and phone to
          assess trustworthiness before engaging in communication or business.
        </p>
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
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded"
        >
          {loading ? "Checking..." : "Check Profile"}
        </button>
      </div>

      {/* LONG DESCRIPTION */}
      <div className="max-w-3xl space-y-4 text-gray-700">
        <h2 className="text-xl font-semibold">How Profile Trust Checker Works</h2>
        <p>
          This tool evaluates identity signals using automated trust indicators
          to identify potential risks before communication, hiring, or financial
          engagement.
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Detect suspicious profile patterns</li>
          <li>Reduce impersonation & scam risk</li>
          <li>Generate trust score with risk level</li>
        </ul>
      </div>

      {/* RESULT */}
      {result && (
        <div
          ref={reportRef}
          className="bg-white border rounded-xl p-6 max-w-xl space-y-4"
        >
          <h3 className="text-xl font-semibold">
            👤 Trustverse AI Profile Trust Report
          </h3>

          <p>
            <strong>Trust Score:</strong>{" "}
            <span className="text-blue-600 font-bold">
              {result.trustScore}/100
            </span>
          </p>

          <p>
            <strong>Risk Level:</strong>{" "}
            <span className="font-bold">{result.risk}</span>
          </p>

          <p>
            <strong>Reason:</strong> {result.reason}
          </p>
          <p>
            <strong>Advice:</strong> {result.advice}
          </p>

          <QRCodeCanvas value={window.location.href} size={120} />

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
              onClick={() => {
                if (navigator.share && result.share) {
                  navigator.share(result.share);
                } else if (result.share) {
                  copyToClipboard(result.share.text);
                }
              }}
              className="bg-emerald-600 text-white px-4 py-2 rounded"
            >
              Share
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
