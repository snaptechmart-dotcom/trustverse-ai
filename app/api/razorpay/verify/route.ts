import { NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Payment from "@/models/Payment"; // ✅ NEW (ONLY ADDITION)

/* ================= CREDIT MAP ================= */

const PLAN_CREDITS: any = {
  prelaunch: { monthly: 50, yearly: 600 },
  essential: { monthly: 150, yearly: 1800 },
  pro: { monthly: 300, yearly: 3600 },
  enterprise: { monthly: 1000, yearly: 12000 },
};

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      planKey,
      billing,
      userId,
      amount, // optional, frontend se aaye to
    } = body;

    if (!userId || !planKey || !billing) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    /* ================= VERIFY SIGNATURE ================= */

    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(sign)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    await dbConnect();

    /* ================= CREDIT CALCULATION ================= */

    const creditsToAdd =
      PLAN_CREDITS?.[planKey]?.[billing] || 0;

    if (creditsToAdd === 0) {
      return NextResponse.json(
        { error: "Invalid plan credits" },
        { status: 400 }
      );
    }

    /* ================= SAVE PAYMENT HISTORY (ONLY ADDITION) ================= */

    await Payment.create({
      userId,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      amount: amount || 0,
      currency: "INR",
      plan: planKey.toUpperCase(),
      billing,
      provider: "Razorpay",
      status: "SUCCESS",
    });

    /* ================= UPDATE USER ================= */

    await User.findByIdAndUpdate(userId, {
      $inc: { credits: creditsToAdd },
      isPro: true,
      plan: planKey.toUpperCase(),
      subscriptionStatus: "active",
    });

    return NextResponse.json({
      success: true,
      creditsAdded: creditsToAdd,
    });
  } catch (err) {
    console.error("VERIFY ERROR:", err);
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    );
  }
}
