// lib/upgradePlan.ts
import prisma from "@/lib/prisma";
import { PLANS, PlanName, BillingCycle } from "@/lib/plans";

export async function upgradeUserPlan(
  userId: string,
  plan: PlanName,
  billing: BillingCycle
) {
  const planConfig = PLANS[plan];
  if (!planConfig) throw new Error("Invalid plan");

  const billingData = planConfig[billing];
  if (!billingData) throw new Error("Invalid billing cycle");

  // 🗓️ EXPIRY LOGIC (FINAL & CORRECT)
  let planExpiresAt: Date | null = null;

  if (plan !== "free") {
    const days = billing === "yearly" ? 365 : 30;
    planExpiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  }

  // ✅ UPDATE USER
  await prisma.user.update({
    where: { id: userId },
    data: {
      plan,
      billing,
      credits: { increment: billingData.credits },
      planExpiresAt,
    },
  });

  return {
    plan,
    billing,
    creditsAdded: billingData.credits,
    planExpiresAt,
  };
}
