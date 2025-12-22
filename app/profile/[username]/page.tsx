import dbConnect from "@/lib/dbConnect";
import TrustScore from "@/models/TrustScore";

type TrustScoreLean = {
  score?: number;
  lastUpdatedReason?: string;
};

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  // ✅ params await (Next.js 16 compatible)
  const { username } = await params;

  await dbConnect();

  const cleanUsername = username.trim().toLowerCase();

  // ✅ EXPLICIT TYPE CAST (THIS FIXES THE BUILD ERROR)
  const trust = (await TrustScore.findOne({
    profileUsername: cleanUsername,
  }).lean()) as TrustScoreLean | null;

  const score = trust?.score ?? 100;

  let status = "Trusted";
  let color = "green";

  if (score < 80 && score >= 50) {
    status = "Average";
    color = "orange";
  }

  if (score < 50) {
    status = "Risky";
    color = "red";
  }

  return (
    <div>
      <h1 style={{ fontSize: 26 }}>
        Profile: {cleanUsername}
      </h1>

      {/* TRUST SCORE CARD */}
      <div
        style={{
          marginTop: 20,
          padding: 16,
          border: "1px solid #ddd",
          borderRadius: 8,
          maxWidth: 320,
        }}
      >
        <h3>Trust Score</h3>

        <p style={{ fontSize: 22 }}>
          <b>{score}</b> / 100
        </p>

        <p style={{ color, fontWeight: "bold" }}>
          {status}
        </p>

        {trust?.lastUpdatedReason && (
          <p style={{ fontSize: 12, color: "#555" }}>
            Reason: {trust.lastUpdatedReason}
          </p>
        )}
      </div>
    </div>
  );
}
