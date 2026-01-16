// lib/plans.ts
// SINGLE SOURCE OF TRUTH – DO NOT DUPLICATE LOGIC ANYWHERE

export type BillingCycle = "monthly" | "yearly";
export type PlanName =
  | "free"
  | "prelaunch"
  | "essential"
  | "pro"
  | "enterprise"
  | "global";

export const PLANS: Record<
  PlanName,
  {
    label: string;
    isPaid: boolean;
    validityDays: number; // plan expiry logic (AUTO)
    monthly?: {
      amount: number; // INR
      credits: number;
    };
    yearly?: {
      amount: number; // INR
      credits: number;
    };
  }
> = {
  // 🔹 FREE PLAN (DEFAULT)
  free: {
    label: "Free",
    isPaid: false,
    validityDays: 0, // no expiry logic
    monthly: {
      amount: 0,
      credits: 10,
    },
  },

  // 🔹 PRE-LAUNCH PLAN
  prelaunch: {
    label: "Prelaunch",
    isPaid: true,
    validityDays: 30,
    monthly: {
      amount: 49,
      credits: 50,
    },
    yearly: {
      amount: 499,
      credits: 600,
    },
  },

  // 🔹 ESSENTIAL PLAN
  essential: {
    label: "Essential",
    isPaid: true,
    validityDays: 30,
    monthly: {
      amount: 149,
      credits: 300,
    },
    yearly: {
      amount: 1499,
      credits: 3600,
    },
  },

  // 🔹 PRO PLAN
  pro: {
    label: "Pro",
    isPaid: true,
    validityDays: 30,
    monthly: {
      amount: 299,
      credits: 600,
    },
    yearly: {
      amount: 2999,
      credits: 8000,
    },
  },

  // 🔹 ENTERPRISE PLAN
  enterprise: {
    label: "Enterprise",
    isPaid: true,
    validityDays: 30,
    monthly: {
      amount: 599,
      credits: 1000,
    },
    yearly: {
      amount: 5999,
      credits: 12000,
    },
  },

  // 🌍 GLOBAL PLAN (LIFETIME / GLOBAL ACCESS)
  global: {
    label: "Global",
    isPaid: true,
    validityDays: 3650, // ~10 YEARS (effectively lifetime)
    monthly: {
      amount: 1999,
      credits: 5000,
    },
    yearly: {
      amount: 14999,
      credits: 100000,
    },
  },
};

// 🔹 HELPER FUNCTIONS (USE EVERYWHERE – NO DUPLICATION)

export function getPlanData(
  plan: PlanName,
  billing: BillingCycle
) {
  const planConfig = PLANS[plan];
  if (!planConfig) return null;

  const billingData = planConfig[billing];
  if (!billingData) return null;

  return {
    plan,
    billing,
    amount: billingData.amount,
    credits: billingData.credits,
    validityDays: planConfig.validityDays,
    isPaid: planConfig.isPaid,
  };
}
