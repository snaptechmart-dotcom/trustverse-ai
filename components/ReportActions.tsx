"use client";

import { QRCodeCanvas } from "qrcode.react";

type Props = {
  title: string;
  shareText: string;
};

export default function ReportActions({ title, shareText }: Props) {
  const downloadPDF = async () => {
    const jsPDF = (await import("jspdf")).default;
    const pdf = new jsPDF();
    pdf.text(title, 10, 20);
    pdf.text(shareText, 10, 30);
    pdf.save("trustverse-report.pdf");
  };

  return (
    <div className="border-t pt-4 space-y-4">
      <div className="flex flex-wrap gap-3">
        <button
          onClick={downloadPDF}
          className="px-4 py-2 bg-gray-900 text-white rounded-md text-sm"
        >
          📄 Download PDF
        </button>

        <button
          onClick={() => navigator.clipboard.writeText(shareText)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm"
        >
          🔗 Copy Report
        </button>
      </div>

      <div>
        <p className="text-sm text-gray-600 mb-1">📱 QR Code</p>
        <QRCodeCanvas value={shareText} size={96} />
      </div>
    </div>
  );
}
