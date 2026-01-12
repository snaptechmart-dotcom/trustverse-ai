import { NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Payment from "@/models/Payment";

export const runtime = "nodejs";

/* =========================
   PLAN → CREDITS (UNCHANGED)
========================= */
const PLAN_CREDITS: any = {
  prelaunch: { monthly: 50, yearly: 600 },
  essential: { monthly: 150, yearly: 1800 },
  pro: { monthly: 300, yearly: 3600 },
  enterprise: { monthly: 1000, yearly: 12000 },
};

/* =========================
   HELPER: EXPIRY CALC
========================= */
function calculateSubscriptionEnd(billing: "monthly" | "yearly") {
  const now = new Date();

  if (billing === "monthly") {
    now.setMonth(now.getMonth() + 1);
  } else {
    now.setFullYear(now.getFullYear() + 1);
  }

  return now;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("✅ VERIFY API HIT");
    console.log("BODY:", body);

    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      planKey,
      billing,
      userId,
    } = body;

    if (!razorpay_payment_id || !planKey || !billing || !userId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await dbConnect();

    /* =========================
       🔐 OPTIONAL SIGNATURE VERIFY
    ========================= */
    if (razorpay_signature && razorpay_order_id) {
      const sign = `${razorpay_order_id}|${razorpay_payment_id}`;
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
        .update(sign)
        .digest("hex");

      if (expectedSignature !== razorpay_signature) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
      }
    }

    /* =========================
       🔁 DUPLICATE PAYMENT CHECK
    ========================= */
    const existingPayment = await Payment.findOne({
      razorpay_payment_id,
    });

    if (existingPayment) {
      return NextResponse.json({ success: true, duplicate: true });
    }

    /* =========================
       🎯 PLAN → CREDITS
    ========================= */
    const credits = PLAN_CREDITS?.[planKey]?.[billing];
    if (!credits) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    /* =========================
       ⏳ SUBSCRIPTION EXPIRY
    ========================= */
    const subscriptionEnd = calculateSubscriptionEnd(billing);

    /* =========================
       💾 SAVE PAYMENT
    ========================= */
    await Payment.create({
      userId,
      plan: planKey,
      billing,
      credits,
      razorpay_payment_id,
      razorpay_order_id,
      status: "SUCCESS",
      provider: "Razorpay",
    });

    /* =========================
       ➕ UPDATE USER
    ========================= */
    await User.findByIdAndUpdate(userId, {
      $inc: { credits },
      isPro: true,
      plan: planKey.toUpperCase(),
      subscriptionStatus: "active",
      subscriptionEnd, // 🔥 NEW FIELD
    });

    return NextResponse.json({
      success: true,
      creditsAdded: credits,
      subscriptionEnd,
    });
  } catch (error) {
    console.error("❌ VERIFY ERROR:", error);
    return NextResponse.json({ error: "Payment failed" }, { status: 500 });
  }
}
