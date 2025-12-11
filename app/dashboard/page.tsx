import Sidebar from "@/components/Sidebar";

export default function DashboardPage() {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-10">
        <h1 className="text-3xl font-bold mb-6">Welcome to Your Dashboard</h1>

        <div className="grid grid-cols-1 md-grid-cols-3 gap-6">

          <div className="p-6 bg-white rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-2">Total Reports</h2>
            <p className="text-3xl font-bold text-blue-600">0</p>
          </div>

          <div className="p-6 bg-white rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-2">Trust Score Checks</h2>
            <p className="text-3xl font-bold text-green-600">0</p>
          </div>

          <div className="p-6 bg-white rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-2">Phone Verifications</h2>
            <p className="text-3xl font-bold text-purple-600">0</p>
          </div>

        </div>

        <div className="mt-10 p-6 bg-white rounded-xl shadow">
          <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
          <p className="text-gray-600">No recent activity yet.</p>
        </div>
      </div>
    </div>
  );
}
