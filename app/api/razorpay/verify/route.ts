import { NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Payment from "@/models/Payment";
import mongoose from "mongoose";

const PLAN_CREDITS: Record<string, any> = {
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

    const userObjectId = new mongoose.Types.ObjectId(userId);

    const alreadyExists = await Payment.findOne({
      razorpay_payment_id,
    });

    if (alreadyExists) {
      return NextResponse.json({ success: true, duplicate: true });
    }

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

    const credits = PLAN_CREDITS?.[planKey]?.[billing];
    if (!credits) {
      return NextResponse.json(
        { error: "Invalid plan or billing" },
        { status: 400 }
      );
    }

    const now = new Date();
    const expiresAt = new Date(now);
    billing === "monthly"
      ? expiresAt.setMonth(expiresAt.getMonth() + 1)
      : expiresAt.setFullYear(expiresAt.getFullYear() + 1);

    await Payment.create({
      userId: userObjectId,
      plan: planKey,
      billing,
      credits,
      razorpay_payment_id,
      razorpay_order_id,
      status: "SUCCESS",
      provider: "Razorpay",
      expiresAt,
    });

    await User.findByIdAndUpdate(userObjectId, {
      $inc: { credits },
      isPro: true,
      plan: planKey.toUpperCase(),
      subscriptionStatus: "active",
      subscriptionExpiresAt: expiresAt,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("VERIFY ERROR:", error);
    return NextResponse.json(
      { error: "Payment verification failed" },
      { status: 500 }
    );
  }
}
