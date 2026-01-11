"use client";

export default function ReportActions() {
  const pageUrl =
    typeof window !== "undefined" ? window.location.href : "";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(pageUrl);
    alert("Report link copied!");
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `Check this Trustverse AI report:\n${pageUrl}`
    );
    window.open(
      `https://wa.me/?text=${text}`,
      "_blank"
    );
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

  const handleDownload = () => {
    window.print();
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
