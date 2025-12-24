"use client";

export default function TrustScoreCard({ score }: { score: number }) {
  let label = "High Risk";
  let color = "text-red-500";

  if (score >= 80) {
    label = "Highly Trusted";
    color = "text-green-500";
  } else if (score >= 60) {
    label = "Moderate Trust";
    color = "text-yellow-500";
  } else if (score >= 40) {
    label = "Caution";
    color = "text-orange-500";
  }

  return (
    <div className="rounded-xl border p-6 text-center">
      <h2 className="text-2xl font-bold">Trust Score</h2>
      <p className={`text-5xl font-extrabold ${color}`}>{score}</p>
      <p className={`mt-2 font-semibold ${color}`}>{label}</p>
    </div>
  );
}
