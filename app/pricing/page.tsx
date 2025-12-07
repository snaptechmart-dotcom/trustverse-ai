"use client";
import { useState } from "react";

// Razorpay को define करना (TypeScript error fix)
declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PricingPage() {
  const [billing, setBilling] = useState("monthly");
  const [currency, setCurrency] = useState("INR");
  const [loading, setLoading] = useState(false);

  // REAL INDIA PLANS
  const INDIA_PLAN_IDS = {
    essential: {
      monthly: "plan_RnT1TzKKyrL7M8",
      yearly: "plan_RnTFcjU6ySKvVJ",
    },
    pro: {
      monthly: "plan_RnT5swluGOmOH4",
      yearly: "plan_RnTH0Ml6Zz3vpP",
    },
    enterprise: {
      monthly: "plan_RnT7wmohs4Lmfe",
      yearly: "plan_RnTIH0R5jw8h25",
    },
  };

  // TEMP GLOBAL PLANS
  const GLOBAL_PLAN_IDS = {
    essential: { monthly: "g_ess_month", yearly: "g_ess_year" },
    pro: { monthly: "g_pro_month", yearly: "g_pro_year" },
    enterprise: { monthly: "g_ent_month", yearly: "g_ent_year" },
  };

  // PRICES
  const PRICES = {
    INR: {
      free: 0,
      essential: billing === "monthly" ? 149 : 1499,
      pro: billing === "monthly" ? 299 : 2999,
      enterprise: billing === "monthly" ? 599 : 5999,
      prelaunch: 49,
    },
    USD: {
      free: 0,
      essential: billing === "monthly" ? 4 : 40,
      pro: billing === "monthly" ? 9 : 90,
      enterprise: billing === "monthly" ? 19 : 190,
      prelaunch: 1,
    },
  };

  // GET PLAN ID
  const getPlanId = (plan: string) => {
    if (plan === "free") return null;
    if (plan === "prelaunch") return process.env.NEXT_PUBLIC_PLAN_PRELAUNCH;

    return currency === "INR"
      ? INDIA_PLAN_IDS[plan][billing]
      : GLOBAL_PLAN_IDS[plan][billing];
  };

  // ⭐ RAZORPAY SUBSCRIBE PROCESS
  const subscribe = async (planKey: string) => {
    const planId = getPlanId(planKey);

    if (!planId) {
      alert("Free plan activated successfully!");
      return;
    }

    setLoading(true);

    // CREATE SUBSCRIPTION
    const res = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planId, planKey }),
    });

    const data = await res.json();
    setLoading(false);

    if (!data?.subscriptionId) {
      alert("Subscription creation failed!");
      return;
    }

    // OPEN RAZORPAY
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      subscription_id: data.subscriptionId,
      name: "Trustverse AI",
      description: `Subscription for ${planKey.toUpperCase()} Plan`,
      image: "/logo.png",

      handler: function () {
        alert("Payment successful!");
        window.location.href = "/dashboard";
      },

      theme: { color: "#0C1633" },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  // ⭐ CARD COMPONENT — highlight = false (default)
  const Card = ({ title, planKey, features, highlight = false }) => {
    const price = PRICES[currency][planKey];

    return (
      <div
        className={`p-6 rounded-2xl bg-[#0C203A] border shadow-xl text-white 
          ${highlight ? "border-blue-500" : "border-blue-800"}`}
      >
        {highlight && (
          <div className="text-center mb-3">
            <span className="bg-blue-600 px-3 py-1 rounded-xl text-sm font-semibold">
              Most Popular
            </span>
          </div>
        )}

        <h3 className="text-2xl font-bold mb-2">{title}</h3>

        <p className="text-4xl font-extrabold text-blue-400">
          {price === 0 ? "Free" : currency === "INR" ? `₹${price}` : `$${price}`}
        </p>

        <p className="text-gray-400 mb-4">
          {price === 0 ? "" : billing === "monthly" ? "/month" : "/year"}
        </p>

        <ul className="text-left space-y-2 mb-6 text-gray-300">
          {features.map((f, i) => (
            <li key={i}>✔ {f}</li>
          ))}
        </ul>

        <button
          disabled={loading}
          onClick={() => subscribe(planKey)}
          className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-semibold"
        >
          {price === 0 ? "Start Free" : loading ? "Please wait..." : "Subscribe"}
        </button>
      </div>
    );
  };

  // UI START
  return (
    <div className="max-w-7xl mx-auto p-6 text-white">

      <h1 className="text-4xl font-bold text-center mb-10">Trustverse Pricing</h1>

      {/* BILLING SWITCH */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          className={`px-5 py-2 rounded ${billing === "monthly" ? "bg-blue-600" : "bg-gray-700"}`}
          onClick={() => setBilling("monthly")}
        >
          Monthly
        </button>

        <button
          className={`px-5 py-2 rounded ${billing === "yearly" ? "bg-blue-600" : "bg-gray-700"}`}
          onClick={() => setBilling("yearly")}
        >
          Yearly (Save 20%)
        </button>
      </div>

      {/* CURRENCY SWITCH */}
      <div className="flex justify-center gap-4 mb-12">
        <button
          className={`px-5 py-2 rounded ${currency === "INR" ? "bg-green-600" : "bg-gray-700"}`}
          onClick={() => setCurrency("INR")}
        >
          INR ₹
        </button>

        <button
          className={`px-5 py-2 rounded ${currency === "USD" ? "bg-green-600" : "bg-gray-700"}`}
          onClick={() => setCurrency("USD")}
        >
          USD $
        </button>
      </div>

      {/* PRE-LAUNCH OFFER */}
      <div className="mb-16">
        <Card
          title="🚀 Pre-Launch Special Offer"
          planKey="prelaunch"
          features={[
            "Unlimited Basic Checks",
            "AI Verified Reports",
            "Email Support",
          ]}
          highlight={true}
        />
      </div>

      {/* MAIN PLANS */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card
          title="Free"
          planKey="free"
          features={["50 Review Requests", "Free Badge", "Basic Dashboard"]}
        />

        <Card
          title="Essential"
          planKey="essential"
          features={["Unlimited Basic Checks", "10 Advanced Checks", "5 PDF Reports"]}
        />

        <Card
          title="Pro"
          planKey="pro"
          highlight={true}
          features={["Unlimited Advanced Checks", "Unlimited PDF Reports", "AI Scam Detector"]}
        />

        <Card
          title="Enterprise"
          planKey="enterprise"
          features={["Team Accounts", "Bulk Verification", "API Access"]}
        />
      </div>
    </div>
  );
}
