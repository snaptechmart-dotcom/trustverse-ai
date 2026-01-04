import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/* ================= CREDIT MAP ================= */

const PLAN_CREDITS: any = {
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
    const { planKey, billing } = body;

    if (!planKey || !billing) {
      return NextResponse.json(
        { error: "Missing plan or billing" },
        { status: 400 }
      );
    }

    const creditsToAdd =
      PLAN_CREDITS?.[planKey]?.[billing] || 0;

    if (creditsToAdd === 0) {
      return NextResponse.json(
        { error: "Invalid plan credits" },
        { status: 400 }
      );
    }

    // 💰 PRICE CALCULATION (₹5 test supported)
    const amount =
      billing === "monthly"
        ? 500 // ₹5 in paise (TEST)
        : 500; // ₹5 yearly test

    /* ================= CREATE ORDER ================= */

    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,

      // 🔥 MOST IMPORTANT PART (WEBHOOK DEPENDS ON THIS)
      notes: {
        userId: user._id.toString(),
        plan: planKey.toUpperCase(),
        billing,
        credits: creditsToAdd.toString(),
      },
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("ORDER CREATE ERROR:", error);
    return NextResponse.json(
      { error: "Order creation failed" },
      { status: 500 }
    );
  }
}
