import { NextResponse } from "next/server";
import crypto from "crypto";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

const CREDIT_MAP: any = {
  prelaunch: 10,
  essential: 100,
  pro: 500,
  enterprise: 2000,
};

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      plan,
      billing,
      currency,
      amount,
    } = await req.json();

    // 🔐 VERIFY SIGNATURE
    const body = razorpay_order_id + "|" + razorpay_payment_id;
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

    // 🛑 DUPLICATE CHECK
    const existing = await prisma.payment.findUnique({
      where: { razorpayPaymentId: razorpay_payment_id },
    });

    if (existing) {
      return NextResponse.json({ success: true });
    }

    const credits = CREDIT_MAP[plan] || 0;

    // 💾 SAVE PAYMENT
    await prisma.payment.create({
      data: {
        userId: session.user.id,
        plan,
        billing,
        amount,
        currency,
        razorpayPaymentId: razorpay_payment_id,
        razorpayOrderId: razorpay_order_id,
        status: "success",
      },
    });

    // ➕ ADD CREDITS
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        credits: {
          increment: credits,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("VERIFY ERROR:", err);
    return NextResponse.json(
      { error: "Payment verification failed" },
      { status: 500 }
    );
  }
}
