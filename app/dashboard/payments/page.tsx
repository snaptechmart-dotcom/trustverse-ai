"use client";

import { useEffect, useState } from "react";

type Payment = {
  _id: string;
  plan: string;
  billing?: string;
  credits: number;
  amount?: number;
  status: string;
  createdAt: string;
};

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await fetch("/api/payments", {
          cache: "no-store",
        });

        const data = await res.json();

        // 🔴 API returns array directly
        setPayments(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Payment fetch error:", err);
        setPayments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  if (loading) {
    return <div className="p-6">Loading payment history...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Payment History</h1>

      {payments.length === 0 ? (
        <p>No payments found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Date</th>
                <th className="border p-2">Plan</th>
                <th className="border p-2">Credits</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Invoice</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p._id} className="text-center">
                  <td className="border p-2">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </td>
                  <td className="border p-2">
                    {p.plan} {p.billing ? `(${p.billing})` : ""}
                  </td>
                  <td className="border p-2">{p.credits}</td>
                  <td className="border p-2">{p.status}</td>
                  <td className="border p-2">
                    <a
                      href={`/api/invoice/${p._id}`}
                      target="_blank"
                      className="text-blue-600 underline"
                    >
                      Download
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
