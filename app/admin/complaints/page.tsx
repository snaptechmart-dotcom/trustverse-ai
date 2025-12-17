"use client";

import ComplaintsTable from "./ComplaintsTable";

export const dynamic = "force-dynamic";

export default function AdminComplaintsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        Admin – Complaints
      </h1>

      <ComplaintsTable />
    </div>
  );
}
