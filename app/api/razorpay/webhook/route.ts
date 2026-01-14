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
    return NextResponse.json({ error: "Invalid webhook" }, { status: 400 });
  }

  const event = JSON.parse(body);

  if (event.event !== "payment.captured") {
    return NextResponse.json({ received: true });
  }

  const payment = event.payload.payment.entity;

  const userId = payment.notes.userId;
  const plan = payment.notes.plan;
  const billing = payment.notes.billing || "monthly";

  const creditsMap: any = {
    free: 10,
    prelaunch: 50,
    pro: 200,
    yearly: 1200,
  };

  const creditsToAdd = creditsMap[plan] || 0;

  // 🔁 DUPLICATE CHECK
  const existing = await prisma.payment.findUnique({
    where: { razorpayPaymentId: payment.id },
  });

  if (existing) {
    return NextResponse.json({ received: true });
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

  // ➕ ADD CREDITS
  await prisma.user.update({
    where: { id: userId },
    data: {
      credits: {
        increment: creditsToAdd,
      },
    },
  });

  return NextResponse.json({ success: true });
}
