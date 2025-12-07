export const runtime = "nodejs";

import crypto from "crypto";
import dbConnect from "../../../lib/dbConnect";
import User from "../../../models/User";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
  await dbConnect();

  const rawBody = await req.text();
  const signature = req.headers.get("x-razorpay-signature");

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(rawBody)
    .digest("hex");

  if (signature !== expectedSignature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(rawBody);

  if (event.event === "subscription.activated") {
    await User.findOneAndUpdate(
      { subscriptionId: event.payload.subscription.entity.id },
      { subscriptionStatus: "active" }
    );
  }

  if (event.event === "subscription.paused") {
    await User.findOneAndUpdate(
      { subscriptionId: event.payload.subscription.entity.id },
      { subscriptionStatus: "paused" }
    );
  }

  return NextResponse.json({ status: "ok" });
}
