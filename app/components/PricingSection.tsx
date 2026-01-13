"use client";

import { useSession } from "next-auth/react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PricingSection() {
  const { data: session } = useSession();

  const handleSubscribe = async (planKey: string) => {
    if (!session?.user) {
      alert("Please login first");
      return;
    }

    /* 1️⃣ CREATE ORDER */
    const orderRes = await fetch("/api/razorpay/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        planKey,
        billing: "monthly",
        amount:
          planKey === "essential"
            ? 299
            : planKey === "pro"
            ? 699
            : 2999,
      }),
    });

    const orderData = await orderRes.json();
    if (!orderRes.ok) {
      alert(orderData.error || "Order creation failed");
      return;
    }

    /* 2️⃣ RAZORPAY OPTIONS */
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: orderData.amount,
      currency: "INR",
      name: "Trustverse AI",
      description: "Subscription Payment",
      order_id: orderData.orderId,

      handler: async function (response: any) {
        console.log("✅ PAYMENT SUCCESS:", response);

        await fetch("/api/razorpay/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            planKey,
            billing: "monthly",
            userId: (session.user as any).id,
          }),
        });

        window.location.href = "/dashboard/payments";
      },

      modal: {
        ondismiss: function () {
          alert(
            "Payment window closed. If amount deducted, it will reflect shortly."
          );
        },
      },

      theme: { color: "#2563eb" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <section className="p-10">
      <button
        onClick={() => handleSubscribe("essential")}
        className="p-4 bg-blue-600 text-white rounded"
      >
        Buy Basic
      </button>

      <button
        onClick={() => handleSubscribe("pro")}
        className="p-4 bg-blue-600 text-white rounded ml-4"
      >
        Buy Pro
      </button>

      <button
        onClick={() => handleSubscribe("enterprise")}
        className="p-4 bg-blue-600 text-white rounded ml-4"
      >
        Buy Agency
      </button>
    </section>
  );
}
