import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";

import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await connectDB();

    const event = await req.json();

    // Example webhook logic
    if (event.type === "payment.captured") {
      await User.findOneAndUpdate(
        { email: event.payload.payment.entity.email },
        { plan: "premium" }
      );
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Razorpay Webhook Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
