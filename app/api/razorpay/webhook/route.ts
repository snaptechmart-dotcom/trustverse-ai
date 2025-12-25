import { NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/dbConnect";
import Subscription from "@/models/Subscription";

export async function POST(req: Request) {
  try {
    console.log("🔥 RAZORPAY WEBHOOK HIT");

    // 1️⃣ Raw body & signature
    const rawBody = await req.text();
    const signature =
      req.headers.get("x-razorpay-signature") || "";

    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!secret) {
      console.error("❌ Missing RAZORPAY_WEBHOOK_SECRET");
      return NextResponse.json(
        { error: "Server config error" },
        { status: 500 }
      );
    }

    // 2️⃣ Verify signature
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");

    if (signature !== expectedSignature) {
      console.error("❌ Invalid Razorpay signature");
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }

    // 3️⃣ Parse event
    const event = JSON.parse(rawBody);
    console.log("📩 Event received:", event.event);

    // 4️⃣ Connect DB
    await dbConnect();

    // 5️⃣ Handle subscription events
    if (event.event?.startsWith("subscription.")) {
      const subscription =
        event.payload?.subscription?.entity;

      if (!subscription) {
        console.warn("⚠️ No subscription entity");
        return NextResponse.json({ status: "ignored" });
      }

      const data = {
        subscriptionId: subscription.id,
        planId: subscription.plan_id,
        status: subscription.status, // created | active | cancelled | etc
        paymentMethod:
          subscription.payment_method || "upi",
        currentPeriodEnd: subscription.current_end
          ? new Date(subscription.current_end * 1000)
          : undefined,
      };

      await Subscription.findOneAndUpdate(
        { subscriptionId: data.subscriptionId },
        data,
        { upsert: true, new: true }
      );

      console.log(
        "✅ Subscription saved/updated:",
        data.subscriptionId,
        data.status
      );
    }

    // 6️⃣ Always respond 200 to Razorpay
    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("🔥 WEBHOOK ERROR FULL:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
