import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email || !session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { planId } = await req.json();

    if (!planId) {
      return NextResponse.json(
        { error: "Missing planId" },
        { status: 400 }
      );
    }

    console.log("PLAN ID:", planId);
    console.log("USER:", session.user.email);

    // 🔥 CREATE SUBSCRIPTION WITH USER METADATA
    const subscription = await razorpay.subscriptions.create({
      plan_id: planId,
      customer_notify: 1,
      total_count: 12,
      start_at: Math.floor(Date.now() / 1000) + 300,

      // 🔑 MOST IMPORTANT PART
      notes: {
        userId: session.user.id,
        email: session.user.email,
        source: "trustverse-ai",
      },
    });

    console.log("SUBSCRIPTION CREATED:", subscription.id);

    return NextResponse.json({
      subscriptionId: subscription.id,
      razorpayKey: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });
  } catch (err: any) {
    console.error("RAZORPAY ERROR FULL:", err);
    return NextResponse.json(
      {
        error: "Subscription creation failed",
        details: err?.message || err,
      },
      { status: 500 }
    );
  }
}
