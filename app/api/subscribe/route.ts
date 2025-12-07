import Razorpay from "razorpay";
import dbConnect from "@/app/lib/dbConnect";
import User from "@/app/models/User";

import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { planId } = await req.json();

    if (!planId) {
      return NextResponse.json({ error: "Plan ID missing" }, { status: 400 });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const subscription = await razorpay.subscriptions.create({
      plan_id: planId,
      total_count: 120,
      quantity: 1,
      customer_notify: 1,
    });

    await User.findByIdAndUpdate(session.user.id, {
      subscriptionId: subscription.id,
      subscriptionStatus: "created",
    });

    return NextResponse.json({
      success: true,
      subscriptionId: subscription.id,
    });
  } catch (err) {
    console.error("Subscribe Error:", err);
    return NextResponse.json(
      { error: "Subscription failed" },
      { status: 500 }
    );
  }
}
