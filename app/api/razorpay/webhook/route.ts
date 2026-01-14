import { NextResponse } from "next/server";
import crypto from "node:crypto";
import prisma from "../../../../lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing signature" },
        { status: 400 }
      );
    }

    const expectedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_WEBHOOK_SECRET as string
      )
      .update(body)
      .digest("hex");

    if (signature !== expectedSignature) {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    const event = JSON.parse(body);

    if (event.event !== "payment.captured") {
      return NextResponse.json({ received: true });
    }

    const payment = event.payload?.payment?.entity;
    if (!payment) {
      return NextResponse.json({ received: true });
    }

    const paymentId = payment.id;
    const orderId = payment.order_id;
    const notes = payment.notes || {};

    const userId = notes.userId;
    const plan = notes.plan;
    const billing = notes.billing;

    if (!userId || !plan || !billing) {
      console.error("Missing notes data", notes);
      return NextResponse.json({ received: true });
    }

    // ❌ DUPLICATE PAYMENT BLOCK
    const alreadyExists = await prisma.payment.findUnique({
      where: {
        razorpayPaymentId: paymentId,
      },
    });

    if (alreadyExists) {
      return NextResponse.json({ received: true });
    }

    const CREDIT_MAP: Record<string, number> = {
      prelaunch: 50,
      essential: 200,
      pro: 500,
      enterprise: 1000,
    };

    // ✅ SAVE PAYMENT
    await prisma.payment.create({
      data: {
        userId,
        plan,
        billing,
        amount: payment.amount / 100,
        currency: payment.currency,
        razorpayPaymentId: paymentId,
        razorpayOrderId: orderId,
        status: "SUCCESS",
      },
    });

    // ✅ ADD CREDITS (ONLY ONCE)
    await prisma.user.update({
      where: { id: userId },
      data: {
        credits: {
          increment: CREDIT_MAP[plan] || 0,
        },
        plan,
      },
    });

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("RAZORPAY WEBHOOK ERROR:", error);
    return NextResponse.json(
      { error: "Webhook error" },
      { status: 500 }
    );
  }
}
