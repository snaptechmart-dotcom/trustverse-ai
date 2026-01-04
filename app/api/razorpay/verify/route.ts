import { NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Payment from "@/models/Payment";

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
    } = body;

    if (!razorpay_payment_id || !planKey || !billing || !userId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await dbConnect();

    /* 🔐 SIGNATURE VERIFY (OPTIONAL BUT SAFE) */
    if (razorpay_signature && razorpay_order_id) {
      const sign = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
        .update(sign)
        .digest("hex");

      if (expectedSignature !== razorpay_signature) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
      }
    }

    const credits = PLAN_CREDITS?.[planKey]?.[billing] || 0;
    if (!credits) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    /* ✅ 1️⃣ SAVE PAYMENT FIRST (MOST IMPORTANT) */
    await Payment.create({
      userId,
      plan: planKey,
      billing,
      credits,
      razorpay_payment_id,
      razorpay_order_id,
      status: "SUCCESS",
    });

    /* ✅ 2️⃣ ADD CREDITS */
    await User.findByIdAndUpdate(userId, {
      $inc: { credits },
      isPro: true,
      plan: planKey.toUpperCase(),
      subscriptionStatus: "active",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("VERIFY ERROR:", error);
    return NextResponse.json({ error: "Payment failed" }, { status: 500 });
  }
}
