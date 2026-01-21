import { NextResponse } from "next/server";
import crypto from "crypto";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getPlanData } from "@/lib/plans";
import dbConnect from "@/lib/dbConnect";
import Payment from "@/models/Payment";
import User from "@/models/User";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    plan,
    billing,
  } = body;

  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (generatedSignature !== razorpay_signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const planData = getPlanData(plan, billing);
  if (!planData || !planData.isPaid) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  await dbConnect();

  const userId = session.user.id;

  /* ✅ SAVE PAYMENT WITH CREDITS */
  await Payment.create({
    userId,
    plan,
    billing,
    amount: planData.amount,
    currency: "INR",
    credits: planData.credits, // 🔥 THIS WAS MISSING
    razorpayOrderId: razorpay_order_id,
    razorpayPaymentId: razorpay_payment_id,
    status: "success",
  });

  const planExpiresAt =
    planData.validityDays > 0
      ? new Date(Date.now() + planData.validityDays * 24 * 60 * 60 * 1000)
      : null;

  /* ✅ UPDATE USER CREDITS */
  await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        plan,
        billing,
        planExpiresAt,
      },
      $inc: {
        credits: planData.credits,
      },
    },
    { new: true }
  );

  return NextResponse.json({ success: true });
}
