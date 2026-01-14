import { NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      plan,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing Razorpay fields" },
        { status: 400 }
      );
    }

    // 🔐 VERIFY SIGNATURE
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400 }
      );
    }

    // 🛑 DUPLICATE PAYMENT CHECK
    const existing = await prisma.payment.findUnique({
      where: { razorpayPaymentId: razorpay_payment_id },
    });

    if (existing) {
      return NextResponse.json(
        { message: "Payment already processed" },
        { status: 200 }
      );
    }

    // 🎯 CREDIT MAP
    const CREDIT_MAP: Record<string, number> = {
      prelaunch: 10,
      essential: 100,
      pro: 300,
      enterprise: 1000,
    };

    const creditsToAdd = CREDIT_MAP[plan] ?? 0;

    // 💾 SAVE PAYMENT + ADD CREDITS (TRANSACTION)
    await prisma.$transaction(async (tx) => {
      await tx.payment.create({
        data: {
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          plan,
          creditsAdded: creditsToAdd,
          status: "SUCCESS",
        },
      });

      await tx.user.update({
        where: { id: body.userId },
        data: {
          credits: {
            increment: creditsToAdd,
          },
        },
      });
    });

    return NextResponse.json({
      success: true,
      creditsAdded: creditsToAdd,
    });
  } catch (error) {
    console.error("VERIFY ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
