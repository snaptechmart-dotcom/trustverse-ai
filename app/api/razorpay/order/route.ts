import Razorpay from "razorpay";
import { NextResponse } from "next/server";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  try {
    const { plan, billing, currency, userId } = await req.json();

    if (!plan || !billing || !currency || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const PRICE_MAP: any = {
      INR: {
        monthly: {
          prelaunch: 5,
          essential: 149,
          pro: 299,
          enterprise: 599,
        },
        yearly: {
          prelaunch: 499,
          essential: 1499,
          pro: 2999,
          enterprise: 5999,
        },
      },
      USD: {
        monthly: {
          prelaunch: 1,
          essential: 4,
          pro: 9,
          enterprise: 19,
        },
        yearly: {
          prelaunch: 9,
          essential: 40,
          pro: 90,
          enterprise: 190,
        },
      },
    };

    const amount = PRICE_MAP?.[currency]?.[billing]?.[plan];

    if (!amount) {
      return NextResponse.json(
        { error: "Invalid plan" },
        { status: 400 }
      );
    }

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency,
      receipt: `rcpt_${plan}_${Date.now()}`,
      notes: {
        userId,   // 🔑 VERY IMPORTANT
        plan,
        billing,
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (err) {
    console.error("ORDER ERROR:", err);
    return NextResponse.json(
      { error: "Order creation failed" },
      { status: 500 }
    );
  }
}
