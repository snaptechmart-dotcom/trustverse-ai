import { NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/dbConnect";
import Subscription from "@/models/Subscription";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    /* ================= 1️⃣ VERIFY SIGNATURE ================= */

    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature") || "";

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

    /* ================= 2️⃣ PARSE EVENT ================= */

    const event = JSON.parse(rawBody);

    const allowedEvents = [
      "subscription.activated",
      "subscription.charged",
      "payment.captured",
    ];

    if (!allowedEvents.includes(event.event)) {
      return NextResponse.json({ status: "ignored" });
    }

    await dbConnect();

    /* ================= 3️⃣ EXTRACT DATA ================= */

    let subscriptionId: string | null = null;
    let planId: string | null = null;
    let status: string | null = null;
    let userId: string | null = null;
    let userEmail: string | null = null;

    // Subscription events
    if (event.payload?.subscription?.entity) {
      const sub = event.payload.subscription.entity;

      subscriptionId = sub.id;
      planId = sub.plan_id;
      status = sub.status;

      userId = sub.notes?.userId || null;
      userEmail = sub.notes?.email || null;
    }

    // Payment events (UPI / card)
    if (
      !subscriptionId &&
      event.payload?.payment?.entity?.subscription_id
    ) {
      const payment = event.payload.payment.entity;

      subscriptionId = payment.subscription_id;
      status = payment.status === "captured" ? "active" : "failed";

      userId = payment.notes?.userId || null;
      userEmail = payment.notes?.email || null;
    }

    if (!subscriptionId || !userId) {
      return NextResponse.json({ status: "ignored" });
    }

    /* ================= 4️⃣ DUPLICATE CREDIT PROTECTION ================= */
    // ⛔ VERY IMPORTANT: prevent double credits

    const alreadyProcessed = await Subscription.findOne({
      subscriptionId,
      status: "active",
    });

    if (alreadyProcessed) {
      console.log("⚠️ Duplicate webhook ignored:", subscriptionId);
      return NextResponse.json({ status: "already_processed" });
    }

    /* ================= 5️⃣ SAVE SUBSCRIPTION ================= */

    await Subscription.findOneAndUpdate(
      { subscriptionId },
      {
        subscriptionId,
        planId,
        status,
        userId,
        userEmail,
      },
      { upsert: true, new: true }
    );

    /* ================= 6️⃣ PLAN → CREDITS MAP ================= */

    let creditsToAdd = 0;
    let planName = "FREE";

    if (planId?.includes("prelaunch")) {
      creditsToAdd = 50;
      planName = "PRELAUNCH";
    } else if (planId?.includes("essential")) {
      creditsToAdd = 150;
      planName = "ESSENTIAL";
    } else if (planId?.includes("pro")) {
      creditsToAdd = 300;
      planName = "PRO";
    } else if (planId?.includes("enterprise")) {
      creditsToAdd = 1000;
      planName = "ENTERPRISE";
    }

    /* ================= 7️⃣ UPDATE USER (ONLY ON ACTIVE PAYMENT) ================= */

    if (status === "active") {
      await User.findByIdAndUpdate(userId, {
        isPro: true,
        plan: planName,
        subscriptionStatus: "active",
        $inc: { credits: creditsToAdd },
      });
    }

    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error("🔥 WEBHOOK ERROR:", error);
    return NextResponse.json(
      { error: "Webhook failed" },
      { status: 500 }
    );
  }
}
