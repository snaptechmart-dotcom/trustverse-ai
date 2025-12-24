import User from "@/models/User";
import Complaint from "@/models/Complaint";
import TrustScoreHistory from "@/models/TrustScoreHistory";

type TrustAction =
  | "EMAIL_VERIFIED"
  | "PHONE_VERIFIED"
  | "COMPLAINT_APPROVED"
  | "COMPLAINT_RESOLVED"
  | "USER_ACTIVITY"
  | "INACTIVITY_PENALTY";

export async function recalculateTrustScore(
  userId: string,
  action: TrustAction,
  meta?: any
) {
  const user = await User.findById(userId);
  if (!user) return;

  let score = user.trustScore ?? 70;
  const oldScore = score;
  let impact = 0;

  // 🔐 VERIFICATIONS
  if (action === "EMAIL_VERIFIED") impact = 5;
  if (action === "PHONE_VERIFIED") impact = 5;

  // 🚨 COMPLAINTS
  if (action === "COMPLAINT_APPROVED") {
    if (meta?.severity === "minor") impact = -5;
    if (meta?.severity === "medium") impact = -10;
    if (meta?.severity === "severe") impact = -25;
  }

  // ✅ RESOLUTION
  if (action === "COMPLAINT_RESOLVED") impact = 5;

  // 📈 ACTIVITY
  if (action === "USER_ACTIVITY") impact = 1;
  if (action === "INACTIVITY_PENALTY") impact = -5;

  // 🧮 APPLY SCORE
  score += impact;

  // 🧱 HARD LIMITS
  if (score > 100) score = 100;
  if (score < 0) score = 0;

  // 💾 SAVE USER
  user.trustScore = score;
  await user.save();

  // 🧾 LOG HISTORY
  await TrustScoreHistory.create({
    userId,
    action,
    impact,
    oldScore,
    newScore: score,
  });

  return score;
}
