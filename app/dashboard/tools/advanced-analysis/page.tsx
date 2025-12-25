export default function AdvancedAnalysisPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Advanced AI Analysis</h1>
      <p className="text-gray-500">
        Deep AI-powered risk and behavior analysis using multiple data sources.
      </p>

      <input
        placeholder="Enter phone / email / username"
        className="w-full max-w-xl bg-slate-50 border border-slate-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-red-500"
      />

      <button className="bg-red-600 text-white px-5 py-2 rounded-md">
        Run AI Analysis (2 Credits)
      </button>

      <div className="max-w-3xl text-gray-700 space-y-3">
        <h2 className="text-lg font-semibold">Advanced insights include</h2>
        <ul className="list-disc pl-5">
          <li>Cross-platform risk detection</li>
          <li>Fraud probability estimation</li>
          <li>High-confidence AI signals</li>
        </ul>
      </div>
    </div>
  );
}
