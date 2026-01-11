import { QRCodeCanvas } from "qrcode.react";

type Props = {
  title: string;
  trustScore: number;
  riskLevel: "Low Risk" | "Medium Risk" | "High Risk";
  signals: string[];
  explanation: string;
  onShare: () => void;
  onDownload: () => void;
  onReport: () => void;
  creditsUsed: number;
  remainingCredits: string | number;
};

export default function ProResultCard({
  title,
  trustScore,
  riskLevel,
  signals,
  explanation,
  onShare,
  onDownload,
  onReport,
  creditsUsed,
  remainingCredits,
}: Props) {
  const riskColor =
    riskLevel === "Low Risk"
      ? "bg-green-100 text-green-700"
      : riskLevel === "Medium Risk"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-red-100 text-red-700";

  return (
    <div className="bg-white border rounded-xl p-6 max-w-xl space-y-4 shadow">
      {/* HEADER */}
      <p className="text-sm text-gray-500">
        🔐 Trustverse AI Verified Report
      </p>

      <p className="text-green-600 font-semibold">
        ✔ Analysis completed successfully
      </p>

      <h3 className="text-xl font-bold">
        {title}
      </h3>

      {/* SCORE */}
      <div className="text-center">
        <p className="text-4xl font-bold text-blue-600">
          {trustScore}
          <span className="text-base text-gray-500"> /100</span>
        </p>

        <span
          className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold ${riskColor}`}
        >
          {riskLevel}
        </span>
      </div>

      {/* SIGNALS */}
      <div>
        <p className="font-semibold mb-1">
          🔍 AI Trust Signals Detected
        </p>
        <ul className="list-disc pl-5 text-gray-700 text-sm">
          {signals.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </div>

      {/* HUMAN MESSAGE */}
      <div className="bg-slate-50 border-l-4 border-emerald-500 p-4 rounded">
        <p className="font-semibold mb-1">
          What does this mean for you?
        </p>
        <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
          {explanation}
        </p>
      </div>

      {/* QR */}
      <div className="flex justify-center">
        <QRCodeCanvas
          value={`Trust Score: ${trustScore} | Risk: ${riskLevel}`}
          size={120}
        />
      </div>

      {/* ACTIONS */}
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          onClick={onShare}
          className="bg-emerald-600 text-white px-4 py-2 rounded"
        >
          Share
        </button>
        <button
          onClick={onDownload}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Download PDF
        </button>
        <button
          onClick={onReport}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Report Scam
        </button>
      </div>

      {/* CREDITS */}
      <p className="text-xs text-gray-500 text-center">
        Credits Used: {creditsUsed} • Remaining:{" "}
        <b>{remainingCredits}</b>
      </p>
    </div>
  );
}
