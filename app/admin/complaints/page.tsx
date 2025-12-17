"use client";

export const dynamic = "force-dynamic";

import ComplaintsTable from "./ComplaintsTable";

export default function ComplaintsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">
        Admin – Complaints
      </h1>

      <ComplaintsTable />
    </div>
  );
}
