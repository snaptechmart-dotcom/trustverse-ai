import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import dbConnect from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { plan, billing, currency } = await req.json();

  const priceMap: any = {
    prelaunch: 5,
    essential: 149,
    pro: 299,
    enterprise: 599,
  };

  const amount = priceMap[plan] * 100;

  const order = await razorpay.orders.create({
    amount,
    currency,
    receipt: `rcpt_${Date.now()}`,
    notes: {
      userId: session.user.id,
      plan,
      billing,
    },
  });

  return NextResponse.json({
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
  });
}
