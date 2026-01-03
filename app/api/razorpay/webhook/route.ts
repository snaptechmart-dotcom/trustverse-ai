import { NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/dbConnect";
import Subscription from "@/models/Subscription";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature") || "";

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(rawBody)
      .digest("hex");

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(rawBody);

    const allowedEvents = [
      "payment.captured",
      "subscription.activated",
      "subscription.charged",
    ];

    if (!allowedEvents.includes(event.event)) {
      return NextResponse.json({ status: "ignored" });
    }

    await dbConnect();

    let userId: string | null = null;
    let planId: string | null = null;
    let subscriptionId: string | null = null;
    let status = "active";

    if (event.payload?.subscription?.entity) {
      const sub = event.payload.subscription.entity;
      subscriptionId = sub.id;
      planId = sub.plan_id;
      userId = sub.notes?.userId || null;
      status = sub.status;
    }

    if (!subscriptionId || !userId) {
      return NextResponse.json({ status: "ok" });
    }

    await Subscription.findOneAndUpdate(
      { subscriptionId },
      {
        subscriptionId,
        planId,
        status,
        userId,
      },
      { upsert: true }
    );

    // ✅ ONLY STATUS UPDATE
    await User.findByIdAndUpdate(userId, {
      subscriptionStatus: status,
    });

    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error("WEBHOOK ERROR:", error);
    return NextResponse.json(
      { error: "Webhook failed" },
      { status: 500 }
    );
  }
}
