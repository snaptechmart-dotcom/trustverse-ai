import { NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Payment from "@/models/Payment";

const PLAN_CREDITS: Record<string, any> = {
  prelaunch: { monthly: 50, yearly: 600 },
  essential: { monthly: 150, yearly: 1800 },
  pro: { monthly: 300, yearly: 3600 },
  enterprise: { monthly: 1000, yearly: 12000 },
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("🔥 RAZORPAY VERIFY HIT");
    console.log("🔥 BODY:", body);

    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      planKey,
      billing,
      userId,
    } = body;

    if (
      !razorpay_payment_id ||
      !razorpay_order_id ||
      !planKey ||
      !billing ||
      !userId
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await dbConnect();

    /* ================= DUPLICATE PAYMENT CHECK ================= */
    const alreadyExists = await Payment.findOne({
      razorpay_payment_id,
    });

    if (alreadyExists) {
      return NextResponse.json({ success: true, duplicate: true });
    }

    /* ================= SIGNATURE VERIFY ================= */
    if (razorpay_signature) {
      const sign = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
        .update(sign)
        .digest("hex");

      if (expectedSignature !== razorpay_signature) {
        return NextResponse.json(
          { error: "Invalid Razorpay signature" },
          { status: 400 }
        );
      }
    }

    /* ================= CREDIT CALC ================= */
    const credits = PLAN_CREDITS?.[planKey]?.[billing];
    if (!credits) {
      return NextResponse.json(
        { error: "Invalid plan or billing" },
        { status: 400 }
      );
    }

    /* ================= PLAN EXPIRY LOGIC ================= */
    const now = new Date();
    let expiresAt = new Date(now);

    if (billing === "monthly") {
      expiresAt.setMonth(expiresAt.getMonth() + 1);
    } else if (billing === "yearly") {
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    }

    /* ================= SAVE PAYMENT ================= */
    await Payment.create({
      userId,
      plan: planKey,
      billing,
      credits,
      razorpay_payment_id,
      razorpay_order_id,
      status: "SUCCESS",
      provider: "Razorpay",
      expiresAt,
    });

    /* ================= UPDATE USER ================= */
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
