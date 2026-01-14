import Razorpay from "razorpay";
import { NextResponse } from "next/server";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  const { plan, billing, currency } = await req.json();

  const amount = billing === "monthly" ? 5 : 499;

  const order = await razorpay.orders.create({
    amount: amount * 100,
    currency,
    receipt: `rcpt_${Date.now()}`,
  });

  return NextResponse.json({
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
  });
}
