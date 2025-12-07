import crypto from "crypto";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { NextResponse } from "next/server";

// 🔥 Next.js 16 FIX → config REMOVE → edge runtime USE
export const runtime = "edge";

// 🔥 Webhook POST Handler
export async function POST(req: Request) {
  await dbConnect();

  // Razorpay sends RAW BODY → use req.text()
  const rawBody = await req.text();
  const signature = req.headers.get("x-razorpay-signature");

  // Generate signature for verification
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(rawBody)
    .digest("hex");

  // ❌ Invalid signature
  if (signature !== expectedSignature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Parse Razorpay event
  const event = JSON.parse(rawBody);

  // Subscription Activated
  if (event.event === "subscription.activated") {
    await User.findOneAndUpdate(
      { subscriptionId: event.payload.subscription.entity.id },
      { subscriptionStatus: "active" }
    );
  }

  // Subscription Paused
  if (event.event === "subscription.paused") {
    await User.findOneAndUpdate(
      { subscriptionId: event.payload.subscription.entity.id },
      { subscriptionStatus: "paused" }
    );
  }

  return NextResponse.json({ status: "ok" });
}
