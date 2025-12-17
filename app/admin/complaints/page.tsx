"use client";

import ComplaintsTable from "./ComplaintsTable";

export default function AdminComplaintsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">
        Complaints Management
      </h1>

      <ComplaintsTable />
    </div>
  );
}
