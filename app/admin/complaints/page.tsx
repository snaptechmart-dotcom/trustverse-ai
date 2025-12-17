"use client";

export const dynamic = "force-dynamic";

import ComplaintsTable from "./ComplaintsTable";

export default function AdminComplaintsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Complaints</h1>
      <ComplaintsTable />
    </div>
  );
}
