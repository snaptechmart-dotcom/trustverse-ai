import User from "@/models/User";
import { PLANS } from "@/lib/plans";

export async function upgradeUserPlan(
  userId: string,
  newPlan: keyof typeof PLANS,
  billing: "monthly" | "yearly"
) {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const planConfig = PLANS[newPlan];
  if (!planConfig) throw new Error("Invalid plan");

  // 🗓️ Expiry calculation
  let expiresAt: Date | undefined = undefined;
  if (planConfig.validityDays > 0) {
    expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + planConfig.validityDays);
  }

  // 🔄 Apply upgrade
  user.plan = newPlan;
  user.planActivatedAt = new Date();
  user.planExpiresAt = expiresAt;

  // 💳 Add credits (✅ FIXED LOGIC)
  let addedCredits = 0;

  if (billing === "monthly" && planConfig.monthly) {
    addedCredits = planConfig.monthly.credits;
  }

  if (billing === "yearly" && planConfig.yearly) {
    addedCredits = planConfig.yearly.credits;
  }

  user.credits += addedCredits;

  await user.save();
  return user;
}
