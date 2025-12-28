import Link from "next/link";

export default function DashboardToolsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">AI Tools</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Trust Score Analyzer */}
        <div className="bg-blue-600 text-white rounded-xl p-6">
          <h2 className="text-lg font-semibold">Trust Score Analyzer</h2>
          <p className="text-sm mt-2">
            AI-powered trust scoring with risk level classification.
          </p>
          <Link href="/dashboard/tools/trust-score">
            <button className="mt-4 bg-white text-blue-600 px-4 py-2 rounded">
              Open Tool
            </button>
          </Link>
        </div>

        {/* Phone Number Checker */}
        <div className="bg-green-600 text-white rounded-xl p-6">
          <h2 className="text-lg font-semibold">Phone Number Checker</h2>
          <p className="text-sm mt-2">
            Detect validity, activity status, and spam probability.
          </p>
          <Link href="/dashboard/tools/phone-checker">
            <button className="mt-4 bg-white text-green-600 px-4 py-2 rounded">
              Open Tool
            </button>
          </Link>
        </div>

        {/* ✅ Email Address Checker (NEW) */}
        <div className="bg-emerald-600 text-white rounded-xl p-6">
          <h2 className="text-lg font-semibold">Email Address Checker</h2>
          <p className="text-sm mt-2">
            Identify risky, disposable, or suspicious email addresses.
          </p>
          <Link href="/dashboard/tools/email-checker">
            <button className="mt-4 bg-white text-emerald-600 px-4 py-2 rounded">
              Open Tool
            </button>
          </Link>
        </div>

        {/* ✅ Profile Trust Checker (NEW) */}
        <div className="bg-indigo-600 text-white rounded-xl p-6">
          <h2 className="text-lg font-semibold">Profile Trust Checker</h2>
          <p className="text-sm mt-2">
            Analyze profile details to estimate trustworthiness and risk.
          </p>
          <Link href="/dashboard/tools/profile-checker">
            <button className="mt-4 bg-white text-indigo-600 px-4 py-2 rounded">
              Open Tool
            </button>
          </Link>
        </div>

        {/* ✅ Business / Domain Checker (NEW) */}
        <div className="bg-teal-600 text-white rounded-xl p-6">
          <h2 className="text-lg font-semibold">Business / Domain Checker</h2>
          <p className="text-sm mt-2">
            Evaluate business and website trust before engagement.
          </p>
          <Link href="/dashboard/tools/business-checker">
            <button className="mt-4 bg-white text-teal-600 px-4 py-2 rounded">
              Open Tool
            </button>
          </Link>
        </div>

        {/* Social Analyzer */}
        <div className="bg-purple-600 text-white rounded-xl p-6">
          <h2 className="text-lg font-semibold">Social Analyzer</h2>
          <p className="text-sm mt-2">
            Analyze usernames from social platforms.
          </p>
          <Link href="/dashboard/tools/social-analyzer">
            <button className="mt-4 bg-white text-purple-600 px-4 py-2 rounded">
              Open Tool
            </button>
          </Link>
        </div>

        {/* Advanced AI Analysis */}
        <div className="bg-orange-600 text-white rounded-xl p-6">
          <h2 className="text-lg font-semibold">Advanced AI Analysis</h2>
          <p className="text-sm mt-2">
            Deep AI reasoning, scam & risk signals.
          </p>
          <Link href="/dashboard/tools/advanced-analysis">
            <button className="mt-4 bg-white text-orange-600 px-4 py-2 rounded">
              Open Tool
            </button>
          </Link>
        </div>

        {/* Report History */}
        <div className="bg-gray-800 text-white rounded-xl p-6">
          <h2 className="text-lg font-semibold">Report History</h2>
          <p className="text-sm mt-2">
            View previous verification and AI reports.
          </p>
          <Link href="/dashboard/history">
            <button className="mt-4 bg-white text-gray-800 px-4 py-2 rounded">
              Open Tool
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}
