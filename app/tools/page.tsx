import Link from "next/link";

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-white px-6 py-16">
      <h1 className="text-4xl font-bold text-center mb-12">
        Trustverse AI Tools
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

        {/* 1 — Trust Score Analyzer */}
        <div className="bg-blue-600 text-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-2">Trust Score Analyzer</h2>
          <p className="opacity-90 mb-4">
            AI-powered trust scoring with risk level classification.
          </p>
          <Link
            href="/tools/trust-score"
            className="bg-white text-black px-4 py-2 rounded shadow font-bold inline-block"
          >
            Open Tool
          </Link>
        </div>

        {/* 2 — Phone Number Checker */}
        <div className="bg-green-600 text-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-2">Phone Number Checker</h2>
          <p className="opacity-90 mb-4">
            Detect validity, activity status, and spam probability.
          </p>
          <Link
            href="/tools/phone-check"
            className="bg-white text-black px-4 py-2 rounded shadow font-bold inline-block"
          >
            Open Tool
          </Link>
        </div>

        {/* 3 — Social Analyzer */}
        <div className="bg-purple-600 text-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-2">Social Analyzer</h2>
          <p className="opacity-90 mb-4">
            Analyze usernames from FB, Instagram, Twitter, LinkedIn.
          </p>
          <Link
            href="/tools/social-analyzer"
            className="bg-white text-black px-4 py-2 rounded shadow font-bold inline-block"
          >
            Open Tool
          </Link>
        </div>

        {/* 4 — Advanced AI Analysis */}
        <div className="bg-orange-600 text-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-2">Advanced AI Analysis</h2>
          <p className="opacity-90 mb-4">
            Deep AI reasoning, risk signals, scam probability.
          </p>
          <Link
            href="/tools/advanced-ai"
            className="bg-white text-black px-4 py-2 rounded shadow font-bold inline-block"
          >
            Open Tool
          </Link>
        </div>

        {/* 5 — Report History */}
        <div className="bg-gray-700 text-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-2">Report History</h2>
          <p className="opacity-90 mb-4">
            View previous verifications and AI reports.
          </p>
          <Link
            href="/tools/history"
            className="bg-white text-black px-4 py-2 rounded shadow font-bold inline-block"
          >
            Open Tool
          </Link>
        </div>

      </div>
    </div>
  );
}
