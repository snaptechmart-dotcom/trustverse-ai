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

    // ✅ CREDIT ADD SIRF payment.captured PAR
    if (event.event !== "payment.captured") {
      return NextResponse.json({ status: "ignored" });
    }

    await dbConnect();

    /* ================= 3️⃣ EXTRACT PAYMENT DATA ================= */

    const payment = event.payload?.payment?.entity;
    if (!payment) {
      return NextResponse.json({ status: "ignored" });
    }

    const subscriptionId = payment.subscription_id || payment.order_id;
    const planId = payment.notes?.planId || "";
    const userId = payment.notes?.userId;
    const userEmail = payment.notes?.email;

    if (!userId || !planId) {
      return NextResponse.json({ status: "missing_user_or_plan" });
    }

    /* ================= 4️⃣ DUPLICATE PAYMENT PROTECTION ================= */

    const alreadyCredited = await Subscription.findOne({
      subscriptionId,
      creditAdded: true,
    });

    if (alreadyCredited) {
      console.log("⚠️ Duplicate payment ignored:", subscriptionId);
      return NextResponse.json({ status: "already_credited" });
    }

    /* ================= 5️⃣ PLAN → CREDITS (MONTHLY + YEARLY) ================= */

    let creditsToAdd = 0;
    let planName = "FREE";

    const isYearly = planId.includes("yearly");

    if (planId.includes("prelaunch")) {
      planName = "PRELAUNCH";
      creditsToAdd = isYearly ? 600 : 50;
    } else if (planId.includes("essential")) {
      planName = "ESSENTIAL";
      creditsToAdd = isYearly ? 1800 : 150;
    } else if (planId.includes("pro")) {
      planName = "PRO";
      creditsToAdd = isYearly ? 3600 : 300;
    } else if (planId.includes("enterprise")) {
      planName = "ENTERPRISE";
      creditsToAdd = isYearly ? 12000 : 1000;
    }

    /* ================= 6️⃣ UPDATE USER ================= */

    await User.findByIdAndUpdate(userId, {
      isPro: true,
      plan: planName,
      subscriptionStatus: "active",
      $inc: { credits: creditsToAdd },
    });

    /* ================= 7️⃣ SAVE PAYMENT RECORD ================= */

    await Subscription.create({
      subscriptionId,
      planId,
      userId,
      userEmail,
      creditsAdded: creditsToAdd,
      creditAdded: true,
      paymentId: payment.id,
      status: "active",
    });

    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error("🔥 WEBHOOK ERROR:", error);
    return NextResponse.json(
      { error: "Webhook failed" },
      { status: 500 }
    );
  }
}
