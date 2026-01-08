"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function HistoryDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      try {
        const res = await fetch(`/api/history/${id}`, {
          credentials: "include",
          cache: "no-store",
        });

        if (!res.ok) {
          setData(null);
        } else {
          const json = await res.json();
          setData(json.history);
        }
      } catch {
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  if (loading) return <p>Loading report…</p>;

  if (!data) {
    return (
      <div className="space-y-4">
        <p className="text-red-600">Report not found</p>
        <button
          onClick={() => router.back()}
          className="text-blue-600 underline"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <h1 className="text-2xl font-bold">
        Trustverse AI – Full Report
      </h1>

      <p><strong>Tool:</strong> {data.tool}</p>
      <p><strong>Input:</strong> {data.query || data.input}</p>

      {data.result?.trustScore && (
        <p className="text-2xl font-bold text-blue-600">
          Trust Score: {data.result.trustScore}/100
        </p>
      )}

      {data.result?.riskLevel && (
        <p className="font-semibold">
          Risk Level: {data.result.riskLevel}
        </p>
      )}

      <div className="space-y-2">
        <h3 className="font-semibold">Detailed Analysis</h3>
        <p className="whitespace-pre-line text-gray-700">
          {data.result?.longReport ||
           data.result?.details?.longReport ||
           "No detailed report available."}
        </p>
      </div>

      <button
        onClick={() => router.back()}
        className="text-blue-600 underline"
      >
        ← Back to History
      </button>
    </div>
  );
}
