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
          <button className="mt-4 bg-white text-blue-600 px-4 py-2 rounded">
            Open Tool
          </button>
        </div>

        {/* Phone Number Checker */}
        <div className="bg-green-600 text-white rounded-xl p-6">
          <h2 className="text-lg font-semibold">Phone Number Checker</h2>
          <p className="text-sm mt-2">
            Detect validity, activity status, and spam probability.
          </p>
          <button className="mt-4 bg-white text-green-600 px-4 py-2 rounded">
            Open Tool
          </button>
        </div>

        {/* Social Analyzer */}
        <div className="bg-purple-600 text-white rounded-xl p-6">
          <h2 className="text-lg font-semibold">Social Analyzer</h2>
          <p className="text-sm mt-2">
            Analyze usernames from social platforms.
          </p>
          <button className="mt-4 bg-white text-purple-600 px-4 py-2 rounded">
            Open Tool
          </button>
        </div>

        {/* Advanced AI Analysis */}
        <div className="bg-orange-600 text-white rounded-xl p-6">
          <h2 className="text-lg font-semibold">Advanced AI Analysis</h2>
          <p className="text-sm mt-2">
            Deep AI reasoning, scam & risk signals.
          </p>
          <button className="mt-4 bg-white text-orange-600 px-4 py-2 rounded">
            Open Tool
          </button>
        </div>

        {/* Report History */}
        <div className="bg-gray-800 text-white rounded-xl p-6">
          <h2 className="text-lg font-semibold">Report History</h2>
          <p className="text-sm mt-2">
            View previous verification and AI reports.
          </p>
          <button className="mt-4 bg-white text-gray-800 px-4 py-2 rounded">
            Open Tool
          </button>
        </div>
      </div>
    </div>
  );
}
