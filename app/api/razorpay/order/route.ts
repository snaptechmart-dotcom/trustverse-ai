import Razorpay from "razorpay";
import { NextResponse } from "next/server";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  try {
    const { plan, billing, currency } = await req.json();

    if (!plan || !billing || !currency) {
      return NextResponse.json(
        { error: "Missing plan, billing or currency" },
        { status: 400 }
      );
    }

    /* ================= PRICE MAP ================= */

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

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid plan amount" },
        { status: 400 }
      );
    }

    /* ================= CREATE ORDER ================= */

    const order = await razorpay.orders.create({
      amount: amount * 100, // paisa / cents
      currency,
      receipt: `rcpt_${plan}_${Date.now()}`,
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (err: any) {
    console.error("RAZORPAY ORDER ERROR:", err);

    return NextResponse.json(
      { error: "Server error while creating order" },
      { status: 500 }
    );
  }
}
