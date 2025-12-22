import Link from "next/link";

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-white px-4 sm:px-6 py-12">
      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-10">
        Trustverse AI Tools
      </h1>

      {/* 🔥 RESPONSIVE GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

        {/* 1 — Trust Score Analyzer */}
        <div className="w-full bg-blue-600 text-white p-5 rounded-xl shadow-lg">
          <h2 className="text-xl sm:text-2xl font-semibold mb-2 break-words">
            Trust Score Analyzer
          </h2>
          <p className="opacity-90 mb-4 text-sm sm:text-base break-words">
            AI-powered trust scoring with risk level classification.
          </p>
          <Link
            href="/tools/trust-score"
            className="block w-full text-center bg-white text-black px-4 py-2 rounded font-bold"
          >
            Open Tool
          </Link>
        </div>

        {/* 2 — Phone Number Checker */}
        <div className="w-full bg-green-600 text-white p-5 rounded-xl shadow-lg">
          <h2 className="text-xl sm:text-2xl font-semibold mb-2 break-words">
            Phone Number Checker
          </h2>
          <p className="opacity-90 mb-4 text-sm sm:text-base break-words">
            Detect validity, activity status, and spam probability.
          </p>
          <Link
            href="/tools/phone-check"
            className="block w-full text-center bg-white text-black px-4 py-2 rounded font-bold"
          >
            Open Tool
          </Link>
        </div>

        {/* 3 — Social Analyzer */}
        <div className="w-full bg-purple-600 text-white p-5 rounded-xl shadow-lg">
          <h2 className="text-xl sm:text-2xl font-semibold mb-2 break-words">
            Social Analyzer
          </h2>
          <p className="opacity-90 mb-4 text-sm sm:text-base break-words">
            Analyze usernames from FB, Instagram, Twitter, LinkedIn.
          </p>
          <Link
            href="/tools/social-analyzer"
            className="block w-full text-center bg-white text-black px-4 py-2 rounded font-bold"
          >
            Open Tool
          </Link>
        </div>

        {/* 4 — Advanced AI Analysis */}
        <div className="w-full bg-orange-600 text-white p-5 rounded-xl shadow-lg">
          <h2 className="text-xl sm:text-2xl font-semibold mb-2 break-words">
            Advanced AI Analysis
          </h2>
          <p className="opacity-90 mb-4 text-sm sm:text-base break-words">
            Deep AI reasoning, risk signals, scam probability.
          </p>
          <Link
            href="/tools/advanced-ai"
            className="block w-full text-center bg-white text-black px-4 py-2 rounded font-bold"
          >
            Open Tool
          </Link>
        </div>

        {/* 5 — Report History */}
        <div className="w-full bg-gray-700 text-white p-5 rounded-xl shadow-lg">
          <h2 className="text-xl sm:text-2xl font-semibold mb-2 break-words">
            Report History
          </h2>
          <p className="opacity-90 mb-4 text-sm sm:text-base break-words">
            View previous verifications and AI reports.
          </p>
          <Link
            href="/tools/history"
            className="block w-full text-center bg-white text-black px-4 py-2 rounded font-bold"
          >
            Open Tool
          </Link>
        </div>

      </div>
    </div>
  );
}
