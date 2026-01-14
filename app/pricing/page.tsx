"use client";

import { useState } from "react";
import Script from "next/script";
import { useSession } from "next-auth/react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PricingPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [currency, setCurrency] = useState<"INR" | "USD">("INR");
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  /* ================= PRICES ================= */

  const PRICES: any = {
    INR: {
      free: 0,
      prelaunch: billing === "monthly" ? 5 : 499,
      essential: billing === "monthly" ? 149 : 1499,
      pro: billing === "monthly" ? 299 : 2999,
      enterprise: billing === "monthly" ? 599 : 5999,
    },
    USD: {
      free: 0,
      prelaunch: billing === "monthly" ? 1 : 9,
      essential: billing === "monthly" ? 4 : 40,
      pro: billing === "monthly" ? 9 : 90,
      enterprise: billing === "monthly" ? 19 : 190,
    },
  };

  /* ================= PAY NOW ================= */

  const payNow = async (planKey: string) => {
    if (!userId) {
      alert("Please login first");
      return;
    }

    const amount = PRICES[currency][planKey];

    if (amount === 0) {
      window.location.href = "/dashboard";
      return;
    }

    setLoadingPlan(planKey);

    try {
      // 1️⃣ CREATE ORDER (SERVER)
      const res = await fetch("/api/razorpay/order", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include", // 🔥 MOST IMPORTANT
  body: JSON.stringify({
    plan: planKey,

    billing,
    currency,
  }),
});


      const data = await res.json();

      if (!res.ok || !data.orderId) {
        alert(data.error || "Order creation failed");
        return;
      }

      // 2️⃣ RAZORPAY CHECKOUT
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: "Trustverse AI",
        description: `${planKey.toUpperCase()} Plan`,
        order_id: data.orderId,
        image: "/logo.png",

        /**
         * ✅ FINAL, STABLE HANDLER
         * - NO verify
         * - NO credits
         * - NO history
         * Webhook will handle everything safely
         */
        handler: function () {
          alert(
            "Payment successful 🎉\nCredits will be added automatically in a few seconds."
          );
          window.location.href = "/dashboard";
        },

        theme: { color: "#0C1633" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoadingPlan(null);
    }
  };

  /* ================= CARD ================= */

  const Card = ({ title, planKey, features, highlight = false }: any) => {
    const price = PRICES[currency][planKey];

    return (
      <div
        className={`p-6 rounded-2xl bg-[#0C203A] border text-white ${
          highlight ? "border-blue-500" : "border-blue-800"
        }`}
      >
        {highlight && (
          <div className="text-center mb-2">
            <span className="bg-blue-600 px-3 py-1 rounded-full text-sm">
              Most Popular
            </span>
          </div>
        )}

        <h3 className="text-2xl font-bold">{title}</h3>

        <p className="text-4xl font-extrabold text-blue-400 mt-2">
          {price === 0
            ? "Free"
            : currency === "INR"
            ? `₹${price}`
            : `$${price}`}
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
          onClick={() => payNow(planKey)}
          className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-semibold"
        >
          {loadingPlan === planKey
            ? "Please wait..."
            : price === 0
            ? "Start Free"
            : "Pay Now"}
        </button>
      </div>
    );
  };

  /* ================= UI ================= */

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
      />

      <div className="max-w-7xl mx-auto p-6 text-white">
        <h1 className="text-4xl font-bold text-center mb-10">
          Trustverse Pricing
        </h1>

        {/* BILLING */}
        <div className="flex justify-center gap-4 mb-4">
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
            Yearly <span className="text-green-300">(Save 20%)</span>
          </button>
        </div>

        {/* CURRENCY */}
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

        {/* PRE-LAUNCH */}
        <div className="mb-16">
          <Card
            title="🚀 Pre-Launch Special"
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

        {/* PLANS */}
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
