import { NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";

/**
 * ✅ PRICE TABLE (MONTHLY + YEARLY)
 * amount is in MAIN currency (₹ / $)
 */
const PRICE_TABLE: any = {
  INR: {
    monthly: {
      prelaunch: 5,
      essential: 149,
      pro: 299,
      enterprise: 599,
    },
    yearly: {
      prelaunch: 499,
      essential: 1499,
      pro: 2999,
      enterprise: 5999,
    },
  },
  USD: {
    monthly: {
      prelaunch: 1,
      essential: 4,
      pro: 9,
      enterprise: 19,
    },
    yearly: {
      prelaunch: 9,
      essential: 40,
      pro: 90,
      enterprise: 190,
    },
  },
};

/**
 * 🎯 CREDIT RULES (ONE SOURCE OF TRUTH)
 */
const CREDIT_TABLE: any = {
  prelaunch: 50,
  essential: 200,
  pro: 500,
  enterprise: 1200,
};

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      plan,        // prelaunch | essential | pro | enterprise
      billing,     // monthly | yearly
      currency,    // INR | USD
      amount,      // in MAIN currency
    } = body;

    // 🛑 BASIC VALIDATION
    if (!PRICE_TABLE[currency]?.[billing]?.[plan]) {
      return NextResponse.json(
        { error: "Invalid plan / billing / currency" },
        { status: 400 }
      );
    }

    // 🔐 SIGNATURE VERIFY
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // 🛑 DUPLICATE PAYMENT CHECK
    const existing = await prisma.payment.findUnique({
      where: { razorpayPaymentId: razorpay_payment_id },
    });

    if (existing) {
      return NextResponse.json({ message: "Payment already processed" });
    }

    // 💰 AMOUNT VERIFY (SECURITY)
    const expectedAmount = PRICE_TABLE[currency][billing][plan];

    if (Number(amount) !== Number(expectedAmount)) {
      return NextResponse.json(
        { error: "Amount mismatch" },
        { status: 400 }
      );
    }

    // 🎯 CREDITS CALCULATION
    let credits = CREDIT_TABLE[plan] || 0;
    if (billing === "yearly") credits = credits * 12;

    // 💾 SAVE PAYMENT (STRICTLY PRISMA FIELDS)
    await prisma.payment.create({
      data: {
        userId,
        plan,
        billing,
        amount: Number(amount),
        currency,
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        status: "success",
      },
    });

    // ➕ ADD CREDITS TO USER
    await prisma.user.update({
      where: { id: userId },
      data: {
        credits: { increment: credits },
      },
    });

    return NextResponse.json({
      success: true,
      creditsAdded: credits,
    });
  } catch (error) {
    console.error("RAZORPAY VERIFY ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
