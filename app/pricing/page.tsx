"use client";
import { useState } from "react";
import Script from "next/script";
declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PricingPage() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [currency, setCurrency] = useState<"INR" | "USD">("INR");
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  // 🇮🇳 INDIA RAZORPAY PLAN IDS (REAL)
  const INDIA_PLAN_IDS: any = {
    essential: {
      monthly: "plan_Rv77jzsU1DyBBh",
      yearly: "plan_Rv7KnvmbXeQFYa",
    },
    pro: {
      monthly: "plan_Rv7ATF8CfP58m6",
      yearly: "plan_Rv7LvPLQbpmH4t",
    },
    enterprise: {
      monthly: "plan_Rv7C9VkwC3KbON",
      yearly: "plan_Rv7NoxGn6F4dWO",
    },
    prelaunch: {
      monthly: "plan_RvQTnvRGqJdH2I",
      yearly: "plan_Rv7P9MaIEHeFvQ",
    },
  };

  // 🌍 GLOBAL PLAN IDS (Stripe / future ready)
  const GLOBAL_PLAN_IDS: any = {
    essential: { monthly: "g_ess_m", yearly: "g_ess_y" },
    pro: { monthly: "g_pro_m", yearly: "g_pro_y" },
    enterprise: { monthly: "g_ent_m", yearly: "g_ent_y" },
    prelaunch: { monthly: "g_pre_m", yearly: "g_pre_y" },
  };

  // 💰 PRICES (20% DISCOUNT APPLIED)
  const PRICES: any = {
    INR: {
      free: 0,
      essential: billing === "monthly" ? 149 : 1499,
      pro: billing === "monthly" ? 299 : 2999,
      enterprise: billing === "monthly" ? 599 : 5999,
      prelaunch: billing === "monthly" ? 49 : 499,
    },
    USD: {
      free: 0,
      essential: billing === "monthly" ? 4 : 40,
      pro: billing === "monthly" ? 9 : 90,
      enterprise: billing === "monthly" ? 19 : 190,
      prelaunch: billing === "monthly" ? 1 : 9,
    },
  };

  // 🔎 GET PLAN ID
  const getPlanId = (planKey: string) => {
    if (planKey === "free") return null;

    const plans =
      currency === "INR" ? INDIA_PLAN_IDS : GLOBAL_PLAN_IDS;

    return plans[planKey]?.[billing];
  };

  // ⭐ SUBSCRIBE
  const subscribe = async (planKey: string) => {
  const planId = getPlanId(planKey);

  if (!planId) {
    alert("Free plan activated!");
    window.location.href = "/dashboard";
    return;
  }

  setLoadingPlan(planKey);

  try {
    console.log("CLICKED PLAN:", planKey, planId);

    const res = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planId }),
    });

    const data = await res.json();
    console.log("API RESPONSE:", data);

    if (!res.ok || !data.subscriptionId) {
      alert(data.error || "Subscription failed");
      return;
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      subscription_id: data.subscriptionId,
      name: "Trustverse AI",
      description: `${planKey.toUpperCase()} Subscription`,
      image: "/logo.png",
      handler: function () {
        alert("Payment successful!");
        window.location.href = "/dashboard";
      },
      theme: { color: "#0C1633" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

  } catch (err) {
    console.error("SUBSCRIBE ERROR:", err);
    alert("Subscription creation failed!");
  } finally {
    setLoadingPlan(null);
  }
};


  // 🧩 CARD
  const Card = ({ title, planKey, features, highlight = false }: any) => {
    const price = PRICES[currency][planKey];

    return (
      <div className={`p-6 rounded-2xl bg-[#0C203A] border text-white ${highlight ? "border-blue-500" : "border-blue-800"}`}>
        {highlight && (
          <div className="text-center mb-2">
            <span className="bg-blue-600 px-3 py-1 rounded-full text-sm">
              Most Popular
            </span>
          </div>
        )}

        <h3 className="text-2xl font-bold">{title}</h3>

        <p className="text-4xl font-extrabold text-blue-400 mt-2">
          {price === 0 ? "Free" : currency === "INR" ? `₹${price}` : `$${price}`}
        </p>

        <p className="text-gray-400 mb-4">
          {price === 0 ? "" : billing === "monthly" ? "/month" : "/year"}
        </p>

        <ul className="space-y-2 mb-6 text-gray-300">
          {features.map((f: string, i: number) => (
            <li key={i}>✔ {f}</li>
          ))}
        </ul>

        <button
          disabled={loadingPlan === planKey}
          onClick={() => subscribe(planKey)}
          className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-semibold"
        >
          {loadingPlan === planKey ? "Please wait..." : price === 0 ? "Start Free" : "Subscribe"}
        </button>
      </div>
    );
  };

 return (
  <>
    {/* 🔥 Razorpay Checkout Script (VERY IMPORTANT) */}
    <Script
      src="https://checkout.razorpay.com/v1/checkout.js"
      strategy="afterInteractive"
    />

    {/* ================= PRICING UI ================= */}
    <div className="max-w-7xl mx-auto p-6 text-white">
      <h1 className="text-4xl font-bold text-center mb-10">
        Trustverse Pricing
      </h1>

      {/* BILLING TOGGLE */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setBilling("monthly")}
          className={`px-5 py-2 rounded ${
            billing === "monthly" ? "bg-blue-600" : "bg-gray-700"
          }`}
        >
          Monthly
        </button>

        <button
          onClick={() => setBilling("yearly")}
          className={`px-5 py-2 rounded ${
            billing === "yearly" ? "bg-blue-600" : "bg-gray-700"
          }`}
        >
          Yearly (Save 20%)
        </button>
      </div>

      {/* CURRENCY TOGGLE */}
      <div className="flex justify-center gap-4 mb-12">
        <button
          onClick={() => setCurrency("INR")}
          className={`px-5 py-2 rounded ${
            currency === "INR" ? "bg-green-600" : "bg-gray-700"
          }`}
        >
          INR ₹
        </button>

        <button
          onClick={() => setCurrency("USD")}
          className={`px-5 py-2 rounded ${
            currency === "USD" ? "bg-green-600" : "bg-gray-700"
          }`}
        >
          USD $
        </button>
      </div>

      {/* 🚀 PRE-LAUNCH OFFER */}
      <div className="mb-16">
        <Card
          title="🚀 Pre-Launch Special Offer"
          planKey="prelaunch"
          highlight
          features={[
            "Unlimited Basic Trust Checks",
            "AI Verified Reports",
            "Early Access Features",
            "Email Support",
          ]}
        />
      </div>

      {/* MAIN PLANS */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card
          title="Free"
          planKey="free"
          features={[
            "50 Review Requests",
            "Free Badge",
            "Basic Dashboard",
          ]}
        />

        <Card
          title="Essential"
          planKey="essential"
          features={[
            "Unlimited Basic Checks",
            "10 Advanced Checks",
            "5 PDF Reports",
          ]}
        />

        <Card
          title="Pro"
          planKey="pro"
          highlight
          features={[
            "Unlimited Advanced Checks",
            "Unlimited PDF Reports",
            "AI Scam Detection",
          ]}
        />

        <Card
          title="Enterprise"
          planKey="enterprise"
          features={[
            "Team Accounts",
            "Bulk Verification",
            "API Access",
          ]}
        />
      </div>
    </div>
  </>
);
}
