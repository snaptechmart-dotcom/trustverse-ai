export const runtime = "nodejs";

import { NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/dbConnect";
import Payment from "@/models/Payment";
import User from "@/models/User";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("x-razorpay-signature")!;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(body)
    .digest("hex");

  if (signature !== expectedSignature) {
    return new NextResponse("Invalid signature", { status: 400 });
  }

  const event = JSON.parse(body);

  await dbConnect();

  if (event.event === "payment.captured") {
    const payment = event.payload.payment.entity;
    const paymentId = payment.id;

    const alreadyExists = await Payment.findOne({ paymentId });
    if (alreadyExists) {
      return NextResponse.json({ received: true });
    }

    const { userId, plan, billing, credits } = payment.notes || {};
    if (!userId || !credits) {
      return NextResponse.json({ received: true });
    }

    await Payment.create({
      userId,
      plan,
      billing,
      credits: Number(credits),
      paymentId,
      orderId: payment.order_id,
      status: "SUCCESS",
      provider: "Razorpay",
    });

    await User.findByIdAndUpdate(userId, {
      $inc: { credits: Number(credits) },
      isPro: true,
      plan,
      subscriptionStatus: "active",
    });
  }

  if (event.event === "payment.failed") {
    const payment = event.payload.payment.entity;
    await Payment.create({
      paymentId: payment.id,
      orderId: payment.order_id,
      status: "FAILED",
      provider: "Razorpay",
    });
  }

  return NextResponse.json({ received: true });
}
