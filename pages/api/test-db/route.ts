import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Subscription from "@/models/Subscription";

export async function GET() {
  await dbConnect();

  const test = await Subscription.create({
    subscriptionId: "test_sub_123",
    status: "active",
    paymentMethod: "upi",
  });

  return NextResponse.json({ ok: true, test });
}
