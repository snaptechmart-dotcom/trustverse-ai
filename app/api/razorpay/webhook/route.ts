import { NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/db";
import Payment from "@/models/Payment";

/* 
  IMPORTANT:
  - Credits webhook me add NAHI honge
  - Credits sirf /api/razorpay/verify se add honge
*/

export async function POST(req: Request) {
  await dbConnect();

  /* ================= VERIFY SIGNATURE ================= */
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;
  const body = await req.text();
  const signature = req.headers.get("x-razorpay-signature") || "";

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");

  if (expectedSignature !== signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(body);

  /* ================= HANDLE ONLY SUCCESS ================= */
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
  const billing = notes.billing || "monthly";

  if (!userId || !plan) {
    return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
  }

  /* ================= PREVENT DUPLICATE PAYMENT ================= */
  const existing = await Payment.findOne({
    razorpay_payment_id: razorpayPaymentId,
  });

  if (existing) {
    return NextResponse.json({ status: "already_saved" });
  }

  /* ================= SAVE PAYMENT (NO CREDIT LOGIC) ================= */
  await Payment.create({
    userId,
    plan,
    billing,
    amount,
    currency,
    razorpay_payment_id: razorpayPaymentId,
    razorpay_order_id: razorpayOrderId,
    status: "success",
  });

  return NextResponse.json({
    status: "payment_logged",
  });
}
