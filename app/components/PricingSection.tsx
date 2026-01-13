"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PricingSection() {
  const [isIndia, setIsIndia] = useState(true);
  const { data: session, status } = useSession();

  const handleSubscribe = async (planKey: "essential" | "pro" | "enterprise") => {
    if (status === "loading") return;

    if (!session?.user?.id) {
      alert("Please login first");
      return;
    }

    /* ================= 1️⃣ CREATE ORDER ================= */
    const orderRes = await fetch("/api/razorpay/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        planKey,
        billing: "monthly",
      }),
    });

    const orderData = await orderRes.json();

    if (!orderRes.ok) {
      alert(orderData.error || "Order creation failed");
      return;
    }

    /* ================= 2️⃣ OPEN RAZORPAY ================= */
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: orderData.amount, // already in paise
      currency: "INR",
      name: "Trustverse AI",
      description: "Subscription Payment",
      order_id: orderData.orderId,

      handler: async function (response: any) {
        /* ================= 3️⃣ VERIFY PAYMENT ================= */
        const verifyRes = await fetch("/api/razorpay/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            planKey,
            billing: "monthly",
            userId: session.user.id,
          }),
        });

        const verifyData = await verifyRes.json();

        if (!verifyRes.ok) {
          alert(verifyData.error || "Payment verification failed");
          return;
        }

        alert("✅ Payment successful! Credits added.");
        window.location.href = "/dashboard/payments";
      },

      theme: { color: "#2563eb" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <section className="w-full py-20 bg-[#06152A] text-white">
      <div className="max-w-7xl mx-auto px-4 text-center">

        {/* Pricing Toggle */}
        <div className="flex justify-center mb-10">
          <div className="flex bg-[#0C203A] p-2 rounded-xl">
            <button
              onClick={() => setIsIndia(true)}
              className={`px-6 py-2 rounded-lg font-semibold ${
                isIndia ? "bg-blue-600" : "bg-transparent"
              }`}
            >
              🇮🇳 India
            </button>
            <button
              onClick={() => setIsIndia(false)}
              className={`px-6 py-2 rounded-lg font-semibold ${
                !isIndia ? "bg-blue-600" : "bg-transparent"
              }`}
            >
              🌍 Global
            </button>
          </div>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-8">

          <button
            onClick={() => handleSubscribe("essential")}
            className="py-4 bg-blue-600 rounded-lg font-semibold"
          >
            Basic – ₹299 / month
          </button>

          <button
            onClick={() => handleSubscribe("pro")}
            className="py-4 bg-blue-600 rounded-lg font-semibold"
          >
            Pro – ₹699 / month
          </button>

          <button
            onClick={() => handleSubscribe("enterprise")}
            className="py-4 bg-blue-600 rounded-lg font-semibold"
          >
            Agency – ₹2999 / month
          </button>

        </div>
      </div>
    </section>
  );
}
