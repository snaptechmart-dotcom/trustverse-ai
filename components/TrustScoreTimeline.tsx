"use client";

type Item = {
  action: string;
  impact: number;
  oldScore: number;
  newScore: number;
  createdAt: string;
};

export default function TrustScoreTimeline({ data }: { data: Item[] }) {
  return (
    <div className="space-y-4">
      {data.map((item, i) => (
        <div key={i} className="border rounded-lg p-4">
          <div className="flex justify-between">
            <span className="font-semibold">{item.action}</span>
            <span
              className={
                item.impact >= 0 ? "text-green-600" : "text-red-600"
              }
            >
              {item.impact > 0 ? "+" : ""}
              {item.impact}
            </span>
          </div>

          <p className="text-sm text-gray-500">
            {item.oldScore} → {item.newScore}
          </p>

          <p className="text-xs text-gray-400">
            {new Date(item.createdAt).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}
