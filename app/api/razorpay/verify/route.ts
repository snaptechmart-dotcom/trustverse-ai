import { NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/dbConnect";
import Subscription from "@/models/Subscription";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    } = body;

    /* ================= 1️⃣ VERIFY SIGNATURE ================= */

    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(sign)
      .digest("hex");

    if (expectedSign !== razorpay_signature) {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    /* ================= 2️⃣ AUTH CHECK ================= */

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    /* ================= 3️⃣ SAVE PAYMENT (NO CREDITS HERE) ================= */

    await Subscription.findOneAndUpdate(
      { orderId: razorpay_order_id },
      {
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        userId: session.user.id,
        status: "paid",
      },
      { upsert: true }
    );

    /* ================= 4️⃣ DONE ================= */

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("VERIFY ERROR:", err);
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    );
  }
}
