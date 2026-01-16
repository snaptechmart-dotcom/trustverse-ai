import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

import { getPlanData } from "@/lib/plans";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  // 🔐 AUTH CHECK (FINAL FIX)
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { plan, billing, currency } = await req.json();

  // 🧠 PLAN VALIDATION (SINGLE SOURCE OF TRUTH)
  const planData = getPlanData(plan, billing);
  if (!planData || !planData.isPaid) {
    return NextResponse.json(
      { error: "Invalid plan" },
      { status: 400 }
    );
  }

  // 💰 AMOUNT (IN PAISE)
  const amount = planData.amount * 100;

  // 🧾 CREATE RAZORPAY ORDER
  const order = await razorpay.orders.create({
    amount,
    currency: currency || "INR",
    receipt: `rcpt_${Date.now()}`,
    notes: {
      userId: session.user.id,
      plan,
      billing,
    },
  });

  return NextResponse.json({
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
  });
}
