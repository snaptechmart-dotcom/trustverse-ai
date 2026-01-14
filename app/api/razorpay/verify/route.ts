import crypto from "crypto";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Payment from "@/models/Payment";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      plan,
    } = await req.json();

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !plan
    ) {
      return NextResponse.json(
        { error: "Missing payment fields" },
        { status: 400 }
      );
    }

    // 🔐 STEP 1: VERIFY SIGNATURE
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    await dbConnect();

    // 🔁 STEP 2: IDEMPOTENCY CHECK (MOST IMPORTANT)
    const alreadyProcessed = await Payment.findOne({
      razorpayPaymentId: razorpay_payment_id,
    });

    if (alreadyProcessed) {
      // ✅ Payment already handled earlier
      return NextResponse.json({
        success: true,
        message: "Payment already verified",
      });
    }

    // 👤 STEP 3: USER
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // 💳 STEP 4: CREDIT MAP (FIXED – NO DOUBLE)
    const CREDIT_MAP: Record<string, number> = {
      prelaunch: 10,
      essential: 100,
      pro: 300,
      enterprise: 1000,
    };

    const creditsToAdd = CREDIT_MAP[plan] ?? 0;

    // ➕ STEP 5: ADD CREDITS (ONLY ONCE)
    user.credits += creditsToAdd;
    await user.save();

    // 🧾 STEP 6: SAVE PAYMENT HISTORY
    await Payment.create({
      userId: user._id,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      plan,
      creditsAdded: creditsToAdd,
      status: "success",
    });

    // ✅ FINAL RESPONSE
    return NextResponse.json({
      success: true,
      message: "Payment verified & credits added",
      creditsAdded: creditsToAdd,
    });
  } catch (err) {
    console.error("VERIFY ERROR:", err);

    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    );
  }
}
