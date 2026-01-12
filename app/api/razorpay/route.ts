import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // ⚠️ path check kar lena

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  try {
    // ✅ Logged-in user session
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || !session.user.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { amount, planKey } = await req.json();

    if (!amount || !planKey) {
      return NextResponse.json(
        { error: "Amount and planKey are required" },
        { status: 400 }
      );
    }

    // ✅ MOST IMPORTANT FIX: userId + email in notes
    const order = await razorpay.orders.create({
      amount: amount * 100, // INR → paise
      currency: "INR",
      receipt: `trustverse_${planKey}_${Date.now()}`,
      notes: {
        userId: session.user.id,       // 🔥 WEBHOOK YAHI SE USER PEHCHANEGA
        email: session.user.email,
        planKey,
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID, // frontend ke liye
    });
  } catch (error) {
    console.error("Razorpay order error:", error);
    return NextResponse.json(
      { error: "Order creation failed" },
      { status: 500 }
    );
  }
}
