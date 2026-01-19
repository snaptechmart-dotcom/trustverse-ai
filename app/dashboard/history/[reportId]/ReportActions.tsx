"use client";

export default function ReportActions() {
  const pageUrl =
    typeof window !== "undefined" ? window.location.href : "";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      alert("Report link copied!");
    } catch {
      alert("Unable to copy link");
    }
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `Check this Trustverse AI report:\n${pageUrl}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const handleTelegram = () => {
    const text = encodeURIComponent(
      "Check this Trustverse AI report"
    );
    window.open(
      `https://t.me/share/url?url=${pageUrl}&text=${text}`,
      "_blank"
    );
  };

  // ✅ FINAL SAFE PDF DOWNLOAD (TS + SSR SAFE)
  const handleDownload = async () => {
    if (typeof window === "undefined") return;

    const element = document.getElementById(
      "report-pdf-content"
    );

    if (!element) {
      alert("Report content not found");
      return;
    }

    // 🔥 Dynamic import + TS safe cast
    const html2pdfModule: any = await import("html2pdf.js");
    const html2pdf = html2pdfModule.default;

    const fileName = `trustverse-report-${new Date()
      .toISOString()
      .slice(0, 10)}.pdf`;

    html2pdf()
      .set({
        margin: [15, 10, 20, 10], // top, right, bottom, left
        filename: fileName,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
        },
        pagebreak: { mode: ["avoid-all"] },
      } as any) // ✅ THIS LINE FIXES TS ERROR
      .from(element)
      .save();
  };

  return (
    <div className="flex flex-wrap gap-3">
      <button
        onClick={handleCopy}
        className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
      >
        Copy Link
      </button>

      <button
        onClick={handleWhatsApp}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        WhatsApp
      </button>

      <button
        onClick={handleTelegram}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Telegram
      </button>

      <button
        onClick={handleDownload}
        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
      >
        Download PDF
      </button>
    </div>
  );
}
