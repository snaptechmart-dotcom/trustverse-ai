import { NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/dbConnect";
import Subscription from "@/models/Subscription";

export async function POST(req: Request) {
 console.log("🔥 RAZORPAY WEBHOOK HIT");
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

  await dbConnect();

  // 🔥 Handle subscription events safely
  if (event.event?.startsWith("subscription.")) {
    const subscription = event.payload?.subscription?.entity;

    if (!subscription) {
      return NextResponse.json({ status: "no subscription payload" });
    }

    const data = {
      subscriptionId: subscription.id,
      planId: subscription.plan_id,
      status: subscription.status, // active / cancelled
      paymentMethod: subscription.payment_method || "upi",
      userEmail:
        subscription.customer_email ||
        subscription.notes?.email ||
        "unknown",
    };

    await Subscription.findOneAndUpdate(
      { subscriptionId: data.subscriptionId },
      data,
      { upsert: true, new: true }
    );
  }

  return NextResponse.json({ status: "ok" });
}
