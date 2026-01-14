import crypto from "crypto";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Payment from "@/models/Payment";

export async function POST(req: Request) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;

  const body = await req.text();
  const signature = req.headers.get("x-razorpay-signature")!;

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");

  if (expectedSignature !== signature) {
    console.error("Webhook signature mismatch");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(body);

  if (event.event !== "payment.captured") {
    return NextResponse.json({ received: true });
  }

  const payment = event.payload.payment.entity;
  const notes = payment.notes;

  await dbConnect();

  const user = await User.findById(notes.userId);
  if (!user) {
    console.error("User not found for payment");
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const CREDIT_MAP: any = {
    prelaunch: 10,
    essential: 100,
    pro: 300,
    enterprise: 1000,
  };

  // ✅ ADD CREDITS
  user.credits += CREDIT_MAP[notes.plan] || 0;
  await user.save();

  // ✅ SAVE PAYMENT HISTORY
  await Payment.create({
    userId: user._id,
    razorpayPaymentId: payment.id,
    amount: payment.amount / 100,
    currency: payment.currency,
    plan: notes.plan,
    status: "success",
  });

  return NextResponse.json({ success: true });
}
