import { NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/dbConnect";
import Subscription from "@/models/Subscription";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature =
      req.headers.get("x-razorpay-signature") || "";

    const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");

    if (signature !== expectedSignature) {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }

    const event = JSON.parse(rawBody);
    await dbConnect();

    let subscriptionId: string | null = null;
    let status: string | null = null;
    let planId: string | null = null;

    // ✅ CASE 1: subscription events
    if (event.payload?.subscription?.entity) {
      const sub = event.payload.subscription.entity;
      subscriptionId = sub.id;
      status = sub.status;
      planId = sub.plan_id;
    }

    // ✅ CASE 2: payment events (UPI Autopay mostly here)
    if (
      !subscriptionId &&
      event.payload?.payment?.entity?.subscription_id
    ) {
      subscriptionId =
        event.payload.payment.entity.subscription_id;

      status = event.event.includes("cancel")
        ? "cancelled"
        : "active";
    }

    if (!subscriptionId) {
      console.log(
        "⚠️ Webhook ignored: no subscriptionId",
        event.event
      );
      return NextResponse.json({ status: "ignored" });
    }

    await Subscription.findOneAndUpdate(
      { subscriptionId },
      {
        subscriptionId,
        planId,
        status,
        paymentMethod: "upi",
      },
      { upsert: true }
    );

    console.log(
      "✅ Subscription saved via webhook:",
      subscriptionId,
      status
    );

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("🔥 WEBHOOK ERROR:", error);
    return NextResponse.json(
      { error: "Webhook failed" },
      { status: 500 }
    );
  }
}
