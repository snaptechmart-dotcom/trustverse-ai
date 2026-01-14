import crypto from "crypto";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Payment from "@/models/Payment";
import User from "@/models/User";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("x-razorpay-signature")!;

  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(body)
    .digest("hex");

  if (expected !== signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(body);

  if (event.event !== "payment.captured") {
    return NextResponse.json({ status: "ignored" });
  }

  await dbConnect();

  const paymentId = event.payload.payment.entity.id;

  const already = await Payment.findOne({ paymentId });
  if (already) {
    return NextResponse.json({ status: "duplicate" });
  }

  const userId = event.payload.payment.entity.notes.userId;
  const plan = event.payload.payment.entity.notes.plan;

  const creditMap: any = {
    prelaunch: 10,
    essential: 100,
    pro: 500,
    enterprise: 2000,
  };

  await Payment.create({
    userId,
    paymentId,
    plan,
    amount: event.payload.payment.entity.amount / 100,
    currency: event.payload.payment.entity.currency,
  });

  await User.findByIdAndUpdate(userId, {
    $inc: { credits: creditMap[plan] },
  });

  return NextResponse.json({ status: "success" });
}
