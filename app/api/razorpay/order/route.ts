import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// ✅ PRICE TABLE (MONTHLY + YEARLY)
const PRICE_TABLE: any = {
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

export async function POST(req: Request) {
  try {
    // 🔐 AUTH CHECK (THIS FIXES 401)
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { plan, billing, currency } = body;

    if (!PRICE_TABLE[currency]?.[billing]?.[plan]) {
      return NextResponse.json(
        { error: "Invalid plan" },
        { status: 400 }
      );
    }

    const amount = PRICE_TABLE[currency][billing][plan] * 100;

    const order = await razorpay.orders.create({
      amount,
      currency,
      receipt: `rcpt_${Date.now()}`,
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("ORDER ERROR:", error);
    return NextResponse.json(
      { error: "Order creation failed" },
      { status: 500 }
    );
  }
}
