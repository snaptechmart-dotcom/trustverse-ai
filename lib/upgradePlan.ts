import User from "@/models/User";
import { PLANS } from "@/lib/plans";

export async function upgradeUserPlan(
  userId: string,
  newPlan: keyof typeof PLANS
) {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const planConfig = PLANS[newPlan];
  if (!planConfig) throw new Error("Invalid plan");

  // 🗓️ Expiry calculation
  let expiresAt: Date | undefined = undefined;
  if (planConfig.durationDays > 0) {
    expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + planConfig.durationDays);
  }

  // 🔄 Apply upgrade
  user.plan = newPlan;
  user.planActivatedAt = new Date();
  user.planExpiresAt = expiresAt;

  // 💳 Add credits
  user.credits += planConfig.credits;

  await user.save();
  return user;
}
