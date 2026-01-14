import { NextResponse } from "next/server";
import crypto from "crypto";
import Razorpay from "razorpay";

import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Payment from "@/models/Payment";

/* ================= RAZORPAY ================= */

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});

/* ================= VERIFY ROUTE ================= */

export async function POST(req: Request) {
  try {
    await dbConnect();

    const body = await req.json();

    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    } = body;

    /* ---------- BASIC CHECK ---------- */

    if (
      !razorpay_payment_id ||
      !razorpay_order_id ||
      !razorpay_signature
    ) {
      return NextResponse.json(
        { error: "Missing Razorpay fields" },
        { status: 400 }
      );
    }

    /* ---------- SIGNATURE VERIFY ---------- */

    const sign = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET as string)
      .update(sign)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: "Invalid Razorpay signature" },
        { status: 400 }
      );
    }

    /* ---------- DUPLICATE CHECK ---------- */

    const alreadyExists = await Payment.findOne({
      razorpay_payment_id,
    });

    if (alreadyExists) {
      return NextResponse.json({
        success: true,
        duplicate: true,
      });
    }

    /* ---------- FETCH ORDER ---------- */

    const order = await razorpay.orders.fetch(razorpay_order_id);
    const notes: any = order?.notes || {};

    /**
     * NOTES EXPECTED (from /order route)
     * userId
     * planKey
     * billing  (monthly | yearly)
     * currency (INR | USD)
     * credits
     */

    const userId = notes.userId;
    const planKey = notes.planKey;
    const billing = notes.billing;
    const currency = notes.currency || "INR";
    const credits = Number(notes.credits);

    if (!userId || !planKey || !billing || !credits) {
      return NextResponse.json(
        { error: "Order notes missing" },
        { status: 400 }
      );
    }

    /* ---------- EXPIRY ---------- */

    const now = new Date();
    const expiresAt = new Date(now);

    if (billing === "yearly") {
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    } else {
      expiresAt.setMonth(expiresAt.getMonth() + 1);
    }

    /* ---------- SAVE PAYMENT ---------- */

    await Payment.create({
      userId,
      plan: planKey,
      billing,
      currency,
      credits,
      razorpay_payment_id,
      razorpay_order_id,
      status: "SUCCESS",
      provider: "Razorpay",
      expiresAt,
    });

    /* ---------- UPDATE USER ---------- */

    await User.findByIdAndUpdate(userId, {
      $inc: { credits },
      isPro: true,
      plan: planKey.toUpperCase(),
      subscriptionStatus: "active",
      subscriptionExpiresAt: expiresAt,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ VERIFY ERROR:", error);
    return NextResponse.json(
      { error: "Payment verification failed" },
      { status: 500 }
    );
  }
}
