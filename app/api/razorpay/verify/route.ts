import crypto from "crypto";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import History from "@/models/History";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    plan,
  } = await req.json();

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    console.error("VERIFY ERROR: Signature mismatch");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  await dbConnect();

  const user = await User.findOne({ email: session.user.email });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const creditMap: any = {
    basic: 10,
    pro: 500,
  };

  user.credits += creditMap[plan];
  await user.save();

  await History.create({
    userId: user._id,
    type: "PAYMENT",
    title: "Plan Purchased",
    description: `${plan} plan activated`,
    meta: {
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
    },
  });

  return NextResponse.json({ success: true });
}
