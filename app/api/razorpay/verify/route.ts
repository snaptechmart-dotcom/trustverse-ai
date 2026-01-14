import { NextResponse } from "next/server";
import crypto from "crypto";
import Razorpay from "razorpay";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Payment from "@/models/Payment";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    } = await req.json();

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing Razorpay fields" },
        { status: 400 }
      );
    }

    // ✅ Signature verify
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

    await dbConnect();

    // ✅ Duplicate check
    const already = await Payment.findOne({ razorpay_payment_id });
    if (already) {
      return NextResponse.json({ success: true });
    }

    // ✅ Fetch order (ONLY FOR NOTES)
    const order = await razorpay.orders.fetch(razorpay_order_id);
    const { userId, plan, billing, credits } = order.notes as any;

    if (!userId || !plan || !billing || !credits) {
      return NextResponse.json(
        { error: "Order notes missing" },
        { status: 400 }
      );
    }

    // ✅ Expiry
    const now = new Date();
    const expiresAt = new Date(now);
    billing === "yearly"
      ? expiresAt.setFullYear(expiresAt.getFullYear() + 1)
      : expiresAt.setMonth(expiresAt.getMonth() + 1);

    // ✅ Save payment (NO amount needed)
    await Payment.create({
      userId,
      plan,
      billing,
      credits: Number(credits),
      razorpay_payment_id,
      razorpay_order_id,
      status: "SUCCESS",
      provider: "Razorpay",
      expiresAt,
    });

    // ✅ Update user credits
    await User.findByIdAndUpdate(userId, {
      $inc: { credits: Number(credits) },
      isPro: true,
      plan,
      subscriptionStatus: "active",
      subscriptionExpiresAt: expiresAt,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("VERIFY ERROR:", err);
    return NextResponse.json(
      { error: "Payment verification failed" },
      { status: 500 }
    );
  }
}
