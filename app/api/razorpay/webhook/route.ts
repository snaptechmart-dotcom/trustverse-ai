import { NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/db";
import Payment from "@/models/Payment";
import User from "@/models/User";

export async function POST(req: Request) {
  await dbConnect();

  const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;
  const body = await req.text();
  const signature = req.headers.get("x-razorpay-signature") || "";

  // 🔐 Verify signature
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");

  if (expectedSignature !== signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(body);

  // ✅ Only handle successful payment
  if (event.event !== "payment.captured") {
    return NextResponse.json({ status: "ignored" });
  }

  const payment = event.payload.payment.entity;

  const razorpayPaymentId = payment.id;
  const razorpayOrderId = payment.order_id;
  const amount = payment.amount / 100; // paisa → rupees
  const currency = payment.currency;
  const notes = payment.notes || {};

  const userId = notes.userId;
  const plan = notes.plan;
  const billing = notes.billing;

  if (!userId || !plan) {
    return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
  }

  // 🔁 Prevent duplicate save
  const existing = await Payment.findOne({ razorpayPaymentId });
  if (existing) {
    return NextResponse.json({ status: "already_saved" });
  }

  // 💾 SAVE PAYMENT
  await Payment.create({
    userId,
    plan,
    billing,
    amount,
    currency,
    razorpayPaymentId,
    razorpayOrderId,
    status: "success",
  });

  // 🎁 ADD CREDITS
  const CREDIT_MAP: any = {
    prelaunch: 50,
    essential: 200,
    pro: 500,
    enterprise: 1000,
  };

  const credits = CREDIT_MAP[plan] || 0;

  await User.findByIdAndUpdate(userId, {
    $inc: { credits },
  });

  return NextResponse.json({ status: "payment_processed" });
}
