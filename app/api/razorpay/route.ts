import crypto from "crypto";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Payment from "@/models/Payment";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("x-razorpay-signature")!;

  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(body)
    .digest("hex");

  if (expected !== signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(body);

  if (event.event !== "payment.captured") {
    return NextResponse.json({ status: "ignored" });
  }

  await dbConnect();

  const payment = event.payload.payment.entity;

  const razorpayPaymentId = payment.id;
  const razorpayOrderId = payment.order_id;
  const amount = payment.amount / 100;
  const currency = payment.currency;
  const notes = payment.notes || {};

  const userId = notes.userId;
  const plan = notes.plan;

  if (!userId || !plan) {
    return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
  }

  const already = await Payment.findOne({
    razorpay_payment_id: razorpayPaymentId,
  });

  if (already) {
    return NextResponse.json({ status: "duplicate" });
  }

  await Payment.create({
    userId,
    plan,
    amount,
    currency,
    razorpay_payment_id: razorpayPaymentId,
    razorpay_order_id: razorpayOrderId,
    status: "success",
  });

  return NextResponse.json({ status: "logged" });
}
