import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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

export async function POST(req: Request) {
  try {
    // 🔐 CHECK LOGIN
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 📥 REQUEST DATA
    const body = await req.json();
    const { plan, billing, currency } = body;

    if (!plan || !billing || !currency) {
      return NextResponse.json(
        { error: "Missing plan/billing/currency" },
        { status: 400 }
      );
    }

    // 💰 PRICE LOOKUP
    const price =
      PRICE_TABLE?.[currency]?.[billing]?.[plan];

    if (!price) {
      return NextResponse.json(
        { error: "Invalid pricing selection" },
        { status: 400 }
      );
    }

    // 💳 RAZORPAY INSTANCE
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    // 🧾 CREATE ORDER (amount in paise/cents)
    const order = await razorpay.orders.create({
      amount: price * 100,
      currency,
      receipt: `rcpt_${Date.now()}`,
      notes: {
        plan,
        billing,
        userEmail: session.user.email,
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("❌ Razorpay order error:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
