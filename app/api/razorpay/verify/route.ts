import { NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/* ================= CREDIT MAP (MONTHLY + YEARLY) ================= */

const PLAN_CREDITS: Record<
  string,
  { monthly: number; yearly: number }
> = {
  prelaunch: { monthly: 50, yearly: 600 },
  essential: { monthly: 150, yearly: 1800 },
  pro: { monthly: 300, yearly: 3600 },
  enterprise: { monthly: 1000, yearly: 12000 },
};

export async function POST(req: Request) {
  try {
    /* ================= READ BODY ================= */

    const body = await req.json();
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      planKey,     // prelaunch | essential | pro | enterprise
      billing,     // "monthly" | "yearly"
    } = body;

    if (
      !razorpay_payment_id ||
      !razorpay_order_id ||
      !razorpay_signature ||
      !planKey ||
      !billing
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    /* ================= VERIFY SIGNATURE ================= */

    const sign =
      razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSign = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET!
      )
      .update(sign)
      .digest("hex");

    if (expectedSign !== razorpay_signature) {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    /* ================= AUTH USER ================= */

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    /* ================= CREDIT CALCULATION ================= */

    const creditsToAdd =
      PLAN_CREDITS[planKey]?.[billing] || 0;

    if (creditsToAdd === 0) {
      return NextResponse.json(
        { error: "Invalid plan or billing" },
        { status: 400 }
      );
    }

    /* ================= UPDATE USER ================= */

    await User.findByIdAndUpdate(session.user.id, {
      $inc: { credits: creditsToAdd },
      isPro: true,
      plan: planKey.toUpperCase(),
      subscriptionStatus: "active",
    });

    return NextResponse.json({
      success: true,
      creditsAdded: creditsToAdd,
    });
  } catch (error) {
    console.error("🔥 VERIFY ERROR:", error);
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    );
  }
}
