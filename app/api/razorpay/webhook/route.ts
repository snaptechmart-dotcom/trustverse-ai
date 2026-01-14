import { NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json({ error: "Signature missing" }, { status: 400 });
    }

    // 🔐 VERIFY WEBHOOK SIGNATURE
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const payload = JSON.parse(body);

    // ✅ ONLY HANDLE SUCCESS PAYMENT
    if (payload.event !== "payment.captured") {
      return NextResponse.json({ received: true });
    }

    const payment = payload.payload.payment.entity;

    const razorpayPaymentId = payment.id;
    const razorpayOrderId = payment.order_id;
    const amount = payment.amount / 100;

    // 🔒 DUPLICATE PAYMENT CHECK
    const existing = await prisma.payment.findUnique({
      where: { razorpayPaymentId },
    });

    if (existing) {
      return NextResponse.json({ received: true });
    }

    // 🔍 GET USER FROM ORDER METADATA (NOTES)
    const userId = payment.notes?.userId;
    const plan = payment.notes?.plan;

    if (!userId || !plan) {
      return NextResponse.json(
        { error: "User or plan missing in notes" },
        { status: 400 }
      );
    }

    // 🎯 CREDIT MAP
    const CREDIT_MAP: Record<string, number> = {
      prelaunch: 10,
      essential: 100,
      pro: 300,
      enterprise: 1000,
    };

    const creditsAdded = CREDIT_MAP[plan] ?? 0;

    // 💾 SAVE PAYMENT + ADD CREDITS (ATOMIC)
    await prisma.$transaction(async (tx) => {
      await tx.payment.create({
        data: {
          userId,
          plan,
          amount,
          creditsAdded,
          razorpayOrderId,
          razorpayPaymentId,
          razorpaySignature: signature,
          status: "success",
        },
      });

      await tx.user.update({
        where: { id: userId },
        data: {
          credits: {
            increment: creditsAdded,
          },
        },
      });
    });

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("WEBHOOK ERROR:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
