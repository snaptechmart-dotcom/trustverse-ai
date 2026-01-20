// lib/plans.ts
// SINGLE SOURCE OF TRUTH — FINAL & LOCKED

export type BillingCycle = "monthly" | "yearly";

export type PlanName =
  | "free"
  | "prelaunch"
  | "essential"
  | "pro"
  | "enterprise"
  | "global";

type PlanConfig = {
  label: string;
  isPaid: boolean;

  // ⏳ MAX TIME VALIDITY (SECONDARY LIMIT)
  validity: {
    monthly: number; // days
    yearly: number;  // days
  };

  monthly?: {
    amount: number;
    credits: number;
  };

  yearly?: {
    amount: number;
    credits: number;
  };
};

export const PLANS: Record<PlanName, PlanConfig> = {
  /* ======================
     FREE PLAN
  ====================== */
  free: {
    label: "Free",
    isPaid: false,
    validity: {
      monthly: 0,
      yearly: 0,
    },
    monthly: {
      amount: 0,
      credits: 10,
    },
  },

  /* ======================
     PRELAUNCH
  ====================== */
  prelaunch: {
    label: "Prelaunch",
    isPaid: true,
    validity: {
      monthly: 30,
      yearly: 365,
    },
    monthly: {
      amount: 49,
      credits: 50,
    },
    yearly: {
      amount: 499,
      credits: 600,
    },
  },

  /* ======================
     ESSENTIAL
  ====================== */
  essential: {
    label: "Essential",
    isPaid: true,
    validity: {
      monthly: 30,
      yearly: 365,
    },
    monthly: {
      amount: 149,
      credits: 300,
    },
    yearly: {
      amount: 1499,
      credits: 3600,
    },
  },

  /* ======================
     PRO
  ====================== */
  pro: {
    label: "Pro",
    isPaid: true,
    validity: {
      monthly: 30,
      yearly: 365,
    },
    monthly: {
      amount: 299,
      credits: 600,
    },
    yearly: {
      amount: 2999,
      credits: 8000,
    },
  },

  /* ======================
     ENTERPRISE
  ====================== */
  enterprise: {
    label: "Enterprise",
    isPaid: true,
    validity: {
      monthly: 30,
      yearly: 365,
    },
    monthly: {
      amount: 599,
      credits: 1000,
    },
    yearly: {
      amount: 5999,
      credits: 12000,
    },
  },

  /* ======================
     GLOBAL (NOT LIFETIME)
  ====================== */
  global: {
    label: "Global",
    isPaid: true,
    validity: {
      monthly: 30,
      yearly: 365,
    },
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

/* ===================================================
   FINAL HELPER — USE EVERYWHERE (NO DUPLICATION)
=================================================== */
export function getPlanData(
  plan: PlanName,
  billing: BillingCycle
) {
  const config = PLANS[plan];
  if (!config) return null;

  const billingData = config[billing];
  if (!billingData) return null;

  return {
    plan,
    billing,

    amount: billingData.amount,
    credits: billingData.credits,

    // ⏳ MAX TIME LIMIT
    validityDays: config.validity[billing],

    // 🔑 IMPORTANT
    // Plan will expire when:
    // 1️⃣ credits reach 0
    // OR
    // 2️⃣ validityDays exceed
    isPaid: config.isPaid,
  };
}
