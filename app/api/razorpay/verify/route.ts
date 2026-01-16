import { NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getPlanData } from "@/lib/plans";

export async function POST(req: Request) {
  // 🔐 SESSION CHECK (FINAL FIX)
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    plan,
    billing,
  } = body;

  // 🔐 RAZORPAY SIGNATURE VERIFICATION (FINAL)
  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (generatedSignature !== razorpay_signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // 🧠 PLAN DATA (SINGLE SOURCE OF TRUTH)
  const planData = getPlanData(plan, billing);
  if (!planData || !planData.isPaid) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  // 🗓️ PLAN EXPIRY (AUTO)
  const planExpiresAt =
    planData.validityDays > 0
      ? new Date(Date.now() + planData.validityDays * 24 * 60 * 60 * 1000)
      : null;

  // 💾 PAYMENT RECORD (SAFE)
  await prisma.payment.create({
    data: {
      userId: session.user.id,
      plan,
      billing,
      amount: planData.amount,
      currency: "INR",
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      status: "success",
    },
  });

  // 👤 USER UPDATE (PLAN + CREDITS + EXPIRY)
  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      plan,
      billing,
      credits: { increment: planData.credits },
      planExpiresAt,
    },
  });

  return NextResponse.json({ success: true });
}
