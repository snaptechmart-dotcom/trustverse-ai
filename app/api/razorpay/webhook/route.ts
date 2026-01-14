import { NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("x-razorpay-signature")!;

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

  const userId = payment.notes.userId;
  const plan = payment.notes.plan;
  const billing = payment.notes.billing;

  // 🔒 DUPLICATE PROTECTION
  const existing = await prisma.payment.findUnique({
    where: { razorpayPaymentId: payment.id },
  });

  if (existing) {
    return NextResponse.json({ status: "already processed" });
  }

  // 💾 SAVE PAYMENT
  await prisma.payment.create({
    data: {
      userId,
      plan,
      billing,
      amount: payment.amount / 100,
      currency: payment.currency,
      razorpayPaymentId: payment.id,
      razorpayOrderId: payment.order_id,
      status: "success",
    },
  });

  // 🎯 ADD CREDITS (example: Prelaunch)
  const creditsToAdd = plan === "prelaunch" ? 100 : 0;

  if (creditsToAdd > 0) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        credits: { increment: creditsToAdd },
      },
    });
  }

  return NextResponse.json({ success: true });
}
