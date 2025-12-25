import { NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/dbConnect";
import Subscription from "@/models/Subscription";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    // 1️⃣ Read raw body & signature
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

    // 2️⃣ Parse event
    const event = JSON.parse(rawBody);
    await dbConnect();

    let subscriptionId: string | null = null;
    let status: string | null = null;
    let planId: string | null = null;
    let userId: string | null = null;
    let userEmail: string | null = null;

    // ✅ CASE 1: subscription events (BEST CASE)
    if (event.payload?.subscription?.entity) {
      const sub = event.payload.subscription.entity;
      subscriptionId = sub.id;
      status = sub.status;
      planId = sub.plan_id;

      // 🔑 READ USER INFO FROM NOTES
      userId = sub.notes?.userId || null;
      userEmail = sub.notes?.email || null;
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

      // Payment events may also carry notes
      userId =
        event.payload.payment.entity.notes?.userId || null;
      userEmail =
        event.payload.payment.entity.notes?.email || null;
    }

    if (!subscriptionId) {
      console.log(
        "⚠️ Webhook ignored: no subscriptionId",
        event.event
      );
      return NextResponse.json({ status: "ignored" });
    }

    // 3️⃣ Save / update subscription
    const savedSubscription =
      await Subscription.findOneAndUpdate(
        { subscriptionId },
        {
          subscriptionId,
          planId,
          status,
          paymentMethod: "upi",
          userId,
          userEmail,
        },
        { upsert: true, new: true }
      );

    console.log(
      "✅ Subscription saved:",
      subscriptionId,
      "User:",
      userId || userEmail
    );

    // 4️⃣ OPTIONAL BUT IMPORTANT:
    // Update user pro status based on subscription
    if (userId) {
      await User.findByIdAndUpdate(userId, {
        isPro: status === "active",
        subscriptionStatus: status,
      });
    }

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("🔥 WEBHOOK ERROR:", error);
    return NextResponse.json(
      { error: "Webhook failed" },
      { status: 500 }
    );
  }
}
