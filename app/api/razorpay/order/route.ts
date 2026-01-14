import Razorpay from "razorpay";
import { NextResponse } from "next/server";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  const { plan } = await req.json();

  if (!plan) {
    return NextResponse.json({ error: "Plan missing" }, { status: 400 });
  }

  const amountMap: any = {
    basic: 5,
    pro: 99,
  };

  const amount = amountMap[plan] * 100;

  const order = await razorpay.orders.create({
    amount,
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  });

  return NextResponse.json({
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
  });
}
