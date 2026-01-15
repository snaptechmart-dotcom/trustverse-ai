import { NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/db";
import Payment from "@/models/Payment";
import User from "@/models/User";

/* ================= CREDIT CONFIG (FIXED) ================= */
const CREDIT_TABLE: any = {
  prelaunch: {
    monthly: 50,
    yearly: 800,
  },
  essential: {
    monthly: 200,
    yearly: 2500,
  },
  pro: {
    monthly: 600,
    yearly: 8000,
  },
  enterprise: {
    monthly: 2000,
    yearly: 30000,
  },
};

export async function POST(req: Request) {
  await dbConnect();

  const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;
  const body = await req.text();
  const signature = req.headers.get("x-razorpay-signature") || "";

  /* ================= VERIFY SIGNATURE ================= */
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

  /* ================= PREVENT DUPLICATE ================= */
  const existing = await Payment.findOne({ razorpayPaymentId });
  if (existing) {
    return NextResponse.json({ status: "already_saved" });
  }

  /* ================= CALCULATE CREDITS ================= */
  const credits =
    CREDIT_TABLE?.[plan]?.[billing] ?? 0;

  /* ================= SAVE PAYMENT ================= */
  await Payment.create({
    userId,
    plan,
    billing,
    amount,
    currency,
    creditsAdded: credits,
    razorpay_payment_id: razorpayPaymentId,
    razorpay_order_id: razorpayOrderId,
    status: "success",
  });

  /* ================= ADD USER CREDITS ================= */
  await User.findByIdAndUpdate(userId, {
    $inc: { credits },
  });

  return NextResponse.json({ status: "payment_processed" });
}
