"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PricingPage() {
  const { data: session } = useSession();

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
    try {
      setLoadingPlan(planKey);

      const amount = PRICES[currency][planKey];
      if (!amount) {
        alert("Invalid plan");
        return;
      }

      // 1️⃣ CREATE ORDER
      const orderRes = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planKey,
          billing,
          amount,
          currency,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderData.success) {
        alert(orderData.error || "Order creation failed");
        return;
      }

      // 2️⃣ OPEN RAZORPAY
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Trustverse AI",
        description: "Subscription Payment",
        order_id: orderData.orderId,
        handler: async function (response: any) {
          // 3️⃣ VERIFY PAYMENT
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });

          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            alert("Payment successful 🎉 Credits added");
            window.location.reload();
          } else {
            alert("Payment verification failed");
          }
        },
        theme: { color: "#2563eb" },
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

  /* ================= UI ================= */

  return (
    <div style={{ padding: 40 }}>
      <h1>Pricing</h1>

      <button onClick={() => setBilling("monthly")}>Monthly</button>
      <button onClick={() => setBilling("yearly")}>Yearly</button>

      <button onClick={() => setCurrency("INR")}>INR</button>
      <button onClick={() => setCurrency("USD")}>USD</button>

      <hr />

      <button onClick={() => payNow("prelaunch")}>
        {loadingPlan === "prelaunch" ? "Please wait..." : "Pay Now"}
      </button>
    </div>
  );
}
