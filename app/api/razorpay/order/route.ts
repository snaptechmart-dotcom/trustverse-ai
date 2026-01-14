import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import Razorpay from "razorpay";

import dbConnect from "@/lib/dbConnect";
import { authOptions } from "@/lib/auth";
import User from "@/models/User";

/* ================= CREDIT MAP ================= */

const PLAN_CREDITS: Record<string, { monthly: number; yearly: number }> = {
  prelaunch: { monthly: 50, yearly: 600 },
  essential: { monthly: 150, yearly: 1800 },
  pro: { monthly: 300, yearly: 3600 },
  enterprise: { monthly: 1000, yearly: 12000 },
};

/* ================= RAZORPAY INSTANCE ================= */

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});

export async function POST(req: Request) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const { planKey, billing, amount, currency } = body;

    if (!planKey || !billing || !amount) {
      return NextResponse.json(
        { error: "Missing plan, billing or amount" },
        { status: 400 }
      );
    }

    const credits =
      PLAN_CREDITS?.[planKey]?.[billing] ?? 0;

    if (!credits) {
      return NextResponse.json(
        { error: "Invalid plan credits" },
        { status: 400 }
      );
    }

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // rupees → paise
      currency: currency || "INR",
      receipt: `rcpt_${Date.now()}`,
      notes: {
        userId: user._id.toString(),
        planKey,
        billing,
        credits: credits.toString(),
      },
    });

    return NextResponse.json({
      orderId: order.id,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("RAZORPAY ORDER ERROR:", error);
    return NextResponse.json(
      { error: "Order creation failed" },
      { status: 500 }
    );
  }
}
