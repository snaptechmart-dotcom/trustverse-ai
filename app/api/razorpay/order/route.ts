import { NextResponse } from "next/server";
import Razorpay from "razorpay";

/**
 * ✅ PRICE TABLE (MONTHLY + YEARLY)
 * amount is in MAIN currency (₹ / $)
 */
const PRICE_TABLE: any = {
  INR: {
    monthly: {
      prelaunch: 5,
      essential: 149,
      pro: 299,
      enterprise: 599,
    },
    yearly: {
      prelaunch: 499,
      essential: 1499,
      pro: 2999,
      enterprise: 5999,
    },
  },
  USD: {
    monthly: {
      prelaunch: 1,
      essential: 4,
      pro: 9,
      enterprise: 19,
    },
    yearly: {
      prelaunch: 9,
      essential: 40,
      pro: 90,
      enterprise: 190,
    },
  },
};

// 🔑 Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      plan,      // prelaunch | essential | pro | enterprise
      billing,   // monthly | yearly
      currency,  // INR | USD
      userId,
    } = body;

    // 🛑 BASIC VALIDATION
    if (!PRICE_TABLE[currency]?.[billing]?.[plan]) {
      return NextResponse.json(
        { error: "Invalid plan / billing / currency" },
        { status: 400 }
      );
    }

    // 💰 AMOUNT (convert to smallest unit)
    const amountMain = PRICE_TABLE[currency][billing][plan];
    const amountSub = amountMain * 100; // paise / cents

    // 🧾 CREATE ORDER
    const order = await razorpay.orders.create({
      amount: amountSub,
      currency,
      receipt: `rcpt_${userId}_${Date.now()}`,
      notes: {
        userId,
        plan,
        billing,
        currency,
      },
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: amountSub,
      currency,
    });
  } catch (error) {
    console.error("RAZORPAY ORDER ERROR:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
