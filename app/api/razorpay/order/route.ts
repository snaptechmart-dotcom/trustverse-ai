import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/* ================= CREDIT MAP ================= */

const PLAN_CREDITS: Record<string, any> = {
  prelaunch: { monthly: 50, yearly: 600 },
  essential: { monthly: 150, yearly: 1800 },
  pro: { monthly: 300, yearly: 3600 },
  enterprise: { monthly: 1000, yearly: 12000 },
};

/* ================= RAZORPAY INSTANCE ================= */

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    console.log("ORDER BODY:", body);

    const { planKey, billing, amount } = body;

    if (!planKey || !billing || !amount) {
      return NextResponse.json(
        { error: "Missing plan, billing or amount" },
        { status: 400 }
      );
    }

    const credits =
      PLAN_CREDITS?.[planKey]?.[billing];

    if (!credits) {
      return NextResponse.json(
        { error: "Invalid plan or billing" },
        { status: 400 }
      );
    }

    /* ================= CREATE ORDER ================= */

    const order = await razorpay.orders.create({
      amount: Number(amount) * 100, // frontend ₹ → paise
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
      notes: {
        userId: user._id.toString(),
        planKey,
        billing,
        credits: credits.toString(),
      },
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      userId: user._id.toString(), // 🔥 VERY IMPORTANT
    });
  } catch (error) {
    console.error("ORDER CREATE ERROR:", error);
    return NextResponse.json(
      { error: "Order creation failed" },
      { status: 500 }
    );
  }
}
