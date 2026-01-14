import { NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("x-razorpay-signature") || "";

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(body)
    .digest("hex");

  if (signature !== expectedSignature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(body);

  if (event.event !== "payment.captured") {
    return NextResponse.json({ status: "ignored" });
  }

  const payment = event.payload.payment.entity;

  const {
    id: razorpayPaymentId,
    order_id: razorpayOrderId,
    amount,
    currency,
    notes,
  } = payment;

  const { userId, plan, billing } = notes;

  if (!userId || !plan || !billing) {
    return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
  }

  // 🔁 DUPLICATE CHECK
  const exists = await prisma.payment.findUnique({
    where: { razorpayPaymentId },
  });

  if (exists) {
    return NextResponse.json({ status: "already_processed" });
  }

  // 💾 SAVE PAYMENT
  await prisma.payment.create({
    data: {
      userId,
      plan,
      billing,
      amount: amount / 100,
      currency,
      razorpayOrderId,
      razorpayPaymentId,
    },
  });

  // 🎯 CREDIT LOGIC
  const CREDIT_MAP: Record<string, number> = {
    prelaunch: 50,
    essential: 200,
    pro: 500,
    enterprise: 1000,
  };

  const creditsToAdd = CREDIT_MAP[plan] || 0;

  await prisma.user.update({
    where: { id: userId },
    data: {
      credits: { increment: creditsToAdd },
    },
  });

  return NextResponse.json({ success: true });
}
