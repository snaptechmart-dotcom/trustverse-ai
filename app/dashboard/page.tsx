export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Welcome to Your Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">Total Reports</p>
          <p className="text-2xl font-bold text-blue-600">0</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">Trust Score Checks</p>
          <p className="text-2xl font-bold text-green-600">0</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">Phone Verifications</p>
          <p className="text-2xl font-bold text-purple-600">0</p>
        </div>
      </div>
    </div>
  );
}
