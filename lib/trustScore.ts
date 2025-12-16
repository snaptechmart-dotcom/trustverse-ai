export type TrustBreakdownItem = {
  label: string;
  points: number;
};

export type TrustScoreResult = {
  score: number;
  breakdown: TrustBreakdownItem[];
  verified: boolean;
};

type TrustProfileInput = {
  displayName?: string;
  category?: string;
  bio?: string;
  verified?: boolean;
  approvedComplaints?: number;
};

export function calculateTrustScore(
  profile: TrustProfileInput
): TrustScoreResult {
  const breakdown: TrustBreakdownItem[] = [];
  let score = 0;

  // 1️⃣ Profile completeness
  if (profile.displayName && profile.category && profile.bio) {
    score += 30;
    breakdown.push({ label: "Profile Completed", points: 30 });
  }

  // 2️⃣ Verification
  if (profile.verified) {
    score += 30;
    breakdown.push({ label: "Identity Verified", points: 30 });
  }

  // 3️⃣ Admin review
  score += 20;
  breakdown.push({ label: "Admin Review", points: 20 });

  // 4️⃣ Complaint penalty
  const complaints = profile.approvedComplaints || 0;
  if (complaints === 0) {
    score += 10;
    breakdown.push({ label: "No Complaints", points: 10 });
  } else {
    const penalty = complaints * 10;
    score -= penalty;
    breakdown.push({
      label: `Approved Complaints (${complaints})`,
      points: -penalty,
    });
  }

  if (score < 0) score = 0;
  if (score > 100) score = 100;

  return {
    score,
    breakdown,
    verified: Boolean(profile.verified),
  };
}
