"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { QRCodeCanvas } from "qrcode.react";
import jsPDF from "jspdf";
import CreditWarningBanner from "@/components/CreditWarningBanner";

type ResultType = {
  phone: string;
  trustScore: number;
  riskLevel: "Low Risk" | "Medium Risk" | "High Risk";
  summary: string;
  signals: string[];
  recommendation: string;
  remainingCredits: number | "unlimited";
};

export default function PhoneCheckerPage() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResultType | null>(null);
  const [credits, setCredits] = useState<number | "unlimited">(0);
  const [expanded, setExpanded] = useState(true);

  const router = useRouter();

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
    return () => {
      window.removeEventListener("credits-updated", fetchCredits);
    };
  }, []);

  const handleCheck = async () => {
    if (!phone.trim()) return;
    if (credits !== "unlimited" && credits <= 0) {
      router.push("/pricing");
      return;
    }

    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/phone-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ phone }),
      });
      if (!res.ok) return;
      const data = await res.json();
      setResult(data);
      setExpanded(true);
      setPhone("");
      window.dispatchEvent(new Event("credits-updated"));
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    if (!result) return;
    const pdf = new jsPDF();
    pdf.text("Trustverse AI – Phone Trust Report", 10, 15);
    pdf.text(`Phone: ${result.phone}`, 10, 30);
    pdf.text(`Trust Score: ${result.trustScore}`, 10, 40);
    pdf.text(`Risk Level: ${result.riskLevel}`, 10, 50);
    pdf.text(result.summary, 10, 65);
    pdf.save("phone-trust-report.pdf");
  };

  return (
    <div className="relative max-w-5xl">

      {/* Desktop guide rail */}
      <div className="hidden lg:block absolute right-0 top-0 h-full w-[2px] bg-gradient-to-b from-transparent via-gray-300 to-transparent" />

      <div className="space-y-12 max-w-4xl">
        {credits !== "unlimited" && <CreditWarningBanner />}

        <div className="space-y-3">
          <h1 className="text-3xl font-bold">Phone Number Checker</h1>
          <p className="text-gray-600 max-w-3xl">
            Identify spam, fraud, and risky phone numbers before responding.
          </p>
        </div>

        <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4 max-w-xl">
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter phone number with country code"
            className="w-full border rounded-md px-4 py-2"
          />
          <button
            onClick={handleCheck}
            disabled={loading}
            className="bg-emerald-600 text-white rounded-md py-2 w-full"
          >
            {loading ? "Checking..." : "Check Number"}
          </button>
        </div>

        {result && (
          <div className="bg-white border rounded-xl shadow-sm max-w-2xl">
            <button
              onClick={() => setExpanded(!expanded)}
              className="w-full flex justify-between px-6 py-4 border-b"
            >
              <span className="font-semibold">📞 Phone Trust Report</span>
              <span>{expanded ? "▾" : "▸"}</span>
            </button>

            {expanded && (
              <div className="p-6 space-y-4">
                <p><b>Phone:</b> {result.phone}</p>
                <p><b>Trust Score:</b> {result.trustScore}/100</p>
                <p><b>Risk Level:</b> {result.riskLevel}</p>

                <div className="border-t pt-4 text-sm space-y-2">
                  <p>{result.summary}</p>
                </div>

                <div className="border-t pt-4 space-y-4">
                  <QRCodeCanvas value={result.phone} size={96} />
                  <div className="flex gap-3">
                    <button onClick={downloadPDF} className="bg-black text-white px-4 py-2 rounded">
                      Download PDF
                    </button>
                    <button className="bg-red-600 text-white px-4 py-2 rounded">
                      Report Scam
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 🔒 DESCRIPTION CONTAINER (DESKTOP LIMITED HEIGHT) */}
        <div
          className="
            pt-10 border-t text-gray-700 max-w-3xl
            lg:max-h-[420px] lg:overflow-y-auto
            lg:pr-4
          "
        >
          <h2 className="text-xl font-semibold mb-4">
            How Phone Number Checker Works
          </h2>

          <p>
            Phone Number Checker helps identify potentially unsafe phone numbers
            using automated trust indicators such as number patterns, scam
            signals, and behavioral risk markers.
          </p>

          <p className="mt-3">
            This tool is useful for verifying unknown callers, online sellers,
            service providers, and business leads before engaging in
            communication or transactions.
          </p>

          <p className="mt-3">
            By providing a trust score and risk level, the tool enables safer
            decision-making and reduces exposure to fraud.
          </p>

          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li>Detect scam and spam numbers</li>
            <li>Prevent financial fraud</li>
            <li>Improve personal safety</li>
          </ul>

          <p className="text-sm text-gray-500 mt-4">
            Automated indicators only. Always verify independently.
          </p>
        </div>
      </div>
    </div>
  );
}
