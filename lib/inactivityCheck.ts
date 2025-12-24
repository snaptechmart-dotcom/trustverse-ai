import User from "@/models/User";
import { recalculateTrustScore } from "@/lib/trustScoreEngine";

export async function applyInactivityPenalty() {
  const THIRTY_DAYS = 1000 * 60 * 60 * 24 * 30;

  const users = await User.find({
    lastActiveAt: { $lt: new Date(Date.now() - THIRTY_DAYS) },
  });

  for (const user of users) {
    await recalculateTrustScore(
      user._id.toString(),
      "INACTIVITY_PENALTY"
    );
  }
}
