import { NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/dbConnect";
import Payment from "@/models/Payment";
import User from "@/models/User";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("x-razorpay-signature") || "";

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(body)
    .digest("hex");

  if (signature !== expectedSignature) {
    return new NextResponse("Invalid signature", { status: 400 });
  }

  const event = JSON.parse(body);
  await dbConnect();

  /* ================= PAYMENT SUCCESS ================= */
  if (event.event === "payment.captured") {
    const payment = event.payload.payment.entity;

    const razorpay_payment_id = payment.id;
    const razorpay_order_id = payment.order_id;

    // 🔁 Duplicate protection
    const exists = await Payment.findOne({ razorpay_payment_id });
    if (exists) {
      return NextResponse.json({ received: true });
    }

    const { userId, planKey } = payment.notes || {};

    // 🔴 userId is mandatory
    if (!userId) {
      return NextResponse.json({ received: true });
    }

    // ✅ BACKEND decides credits (example: ₹49 = 10 credits)
    const creditsToAdd = 10;

    // ✅ SAVE PAYMENT HISTORY
    await Payment.create({
      userId,
      plan: planKey || "credits",
      billing: "one_time",
      credits: creditsToAdd,
      razorpay_payment_id,
      razorpay_order_id,
      amount: payment.amount / 100,
      status: "SUCCESS",
      provider: "Razorpay",
    });

    // ✅ ADD CREDITS TO USER
    await User.findByIdAndUpdate(userId, {
      $inc: { credits: creditsToAdd },
      isPro: true,
      plan: planKey || "credits",
      subscriptionStatus: "active",
    });
  }

  /* ================= PAYMENT FAILED ================= */
  if (event.event === "payment.failed") {
    const payment = event.payload.payment.entity;

    await Payment.create({
      razorpay_payment_id: payment.id,
      razorpay_order_id: payment.order_id,
      amount: payment.amount / 100,
      status: "FAILED",
      provider: "Razorpay",
    });
  }

  return NextResponse.json({ received: true });
}
