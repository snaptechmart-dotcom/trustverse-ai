import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex bg-gray-50 min-h-screen">
      
      {/* LEFT SIDEBAR */}
      <div className="w-64 hidden md:block">
        <Sidebar />
      </div>

      {/* RIGHT CONTENT AREA */}
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}
