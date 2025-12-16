import Link from "next/link";

export default function AdminSidebar() {
  return (
    <aside className="w-64 bg-gray-900 text-white p-5">
      <h2 className="text-xl font-bold mb-6">Trustverse Admin</h2>

      <nav className="space-y-3">
        <Link href="/admin/complaints" className="block hover:text-blue-400">
          Complaints
        </Link>

        <Link href="/admin/history" className="block hover:text-blue-400">
          History
        </Link>
      </nav>
    </aside>
  );
}
