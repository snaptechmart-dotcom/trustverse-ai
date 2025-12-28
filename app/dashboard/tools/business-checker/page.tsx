"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CreditWarningBanner from "@/components/CreditWarningBanner";

type ResultType = {
  status: string;
  businessName: string;
  domain: string;
  trustScore: number;
  riskLevel: "Low Risk" | "Medium Risk" | "High Risk";
  remainingCredits: number | "unlimited";
};

export default function BusinessCheckerPage() {
  const [businessName, setBusinessName] = useState("");
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResultType | null>(null);

  const router = useRouter();

  const handleCheck = async () => {
    if (!businessName.trim() || !domain.trim()) {
      alert("Business name and domain are required.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/business-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: businessName.trim(),
          domain: domain.trim(),
        }),
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
        alert("Service temporarily unavailable.");
        return;
      }

      const data: ResultType = await res.json();
      setResult(data);

      setBusinessName("");
      setDomain("");
      window.dispatchEvent(new Event("credits-updated"));
    } catch (err) {
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 max-w-4xl">
      <CreditWarningBanner />

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Business / Domain Trust Checker
        </h1>
        <p className="text-gray-500 mt-2 max-w-3xl">
          Evaluate the trustworthiness of businesses and websites before
          engaging, purchasing, or sharing sensitive information.
        </p>
      </div>

      {/* INPUT CARD */}
      <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4 max-w-xl">
        <input
          type="text"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          placeholder="Enter business name"
          className="w-full bg-slate-50 border border-slate-300 rounded-md px-4 py-2
          focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />

        <input
          type="text"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="Enter website or domain (e.g. example.com)"
          className="w-full bg-slate-50 border border-slate-300 rounded-md px-4 py-2
          focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />

        <button
          onClick={handleCheck}
          disabled={loading}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-md
          transition disabled:opacity-60"
        >
          {loading ? "Checking..." : "Check Business"}
        </button>
      </div>

      {/* RESULT */}
      {result && (
        <div className="bg-white border rounded-xl p-6 max-w-2xl space-y-5">
          <h3 className="text-xl font-semibold text-gray-900">
            🏢 Trustverse AI Business Trust Report
          </h3>

          <p>
            <strong>Verification Status:</strong>{" "}
            <span className="text-emerald-600 font-semibold">
              Successfully Completed ✅
            </span>
          </p>

          <p className="text-sm text-gray-700">
            <strong>Business Name:</strong> {result.businessName}
          </p>
          <p className="text-sm text-gray-700">
            <strong>Domain:</strong> {result.domain}
          </p>

          <div className="space-y-2 text-gray-700">
            <p>
              <strong>Trust Assessment Summary:</strong>
            </p>
            <p className="text-sm leading-relaxed">
              Our system analyzed the provided business and domain information
              using automated trust indicators such as domain structure,
              consistency signals, and general risk patterns. Based on these
              checks, the business shows a{" "}
              <strong>{result.riskLevel}</strong> confidence level.
            </p>
          </div>

          <p>
            <strong>Trust Score:</strong>{" "}
            <span className="font-bold text-blue-600">
              {result.trustScore} / 100
            </span>
          </p>

          <p>
            <strong>Final Risk Level:</strong>{" "}
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

          <p className="text-xs text-gray-500 italic">
            This result is generated using automated indicators and is intended
            for guidance only. Upgrade to Pro for deeper trust insights and
            unlimited checks.
          </p>
        </div>
      )}

      {/* DESCRIPTION */}
      <div className="space-y-6 text-gray-700 max-w-3xl">
        <h2 className="text-xl font-semibold text-gray-900">
          How Business / Domain Trust Checker Works
        </h2>

        <p>
          Business Trust Checker helps assess whether a business or website
          appears trustworthy based on publicly observable patterns and general
          risk indicators. It is useful for buyers, freelancers, and businesses
          before engagement.
        </p>

        <ul className="list-disc pl-6 space-y-2">
          <li>Evaluate website and business credibility</li>
          <li>Identify potentially risky or suspicious domains</li>
          <li>Reduce chances of fraud or scam engagements</li>
          <li>Support safer business decisions</li>
        </ul>

        <p className="text-sm text-gray-500">
          Disclaimer: This tool provides automated risk indicators only and does
          not guarantee business legitimacy. Always conduct independent
          verification for critical decisions.
        </p>
      </div>
    </div>
  );
}
