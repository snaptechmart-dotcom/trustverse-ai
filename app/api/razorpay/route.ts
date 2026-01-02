import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  try {
    const { amount, planKey } = await req.json();

    if (!amount) {
      return NextResponse.json(
        { error: "Amount is required" },
        { status: 400 }
      );
    }

    const order = await razorpay.orders.create({
      amount: amount * 100, // ⚠️ paise
      currency: "INR",
      receipt: `trustverse_${planKey}_${Date.now()}`,
    });

    return NextResponse.json({ orderId: order.id });
  } catch (error) {
    console.error("Razorpay error:", error);
    return NextResponse.json(
      { error: "Order creation failed" },
      { status: 500 }
    );
  }
}
