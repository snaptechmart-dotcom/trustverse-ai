import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import dbConnect from "@/lib/dbConnect";
import Subscription from "@/models/Subscription";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end("Method Not Allowed");
  }

  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(chunk as Buffer);
  }
  const rawBody = Buffer.concat(chunks).toString("utf8");

  const signature = req.headers["x-razorpay-signature"] as string;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(rawBody)
    .digest("hex");

  if (signature !== expectedSignature) {
    console.error("❌ Invalid Razorpay signature");
    return res.status(401).json({ error: "Invalid signature" });
  }

  const event = JSON.parse(rawBody);

  await dbConnect();

  let subscriptionId: string | null = null;
  let status: string | null = null;
  let planId: string | null = null;

  // 🔥 CASE 1: subscription.* events
  if (event.payload?.subscription?.entity) {
    const sub = event.payload.subscription.entity;
    subscriptionId = sub.id;
    status = sub.status;
    planId = sub.plan_id;
  }

  // 🔥 CASE 2: payment.* events (subscription_id nested here)
  if (!subscriptionId && event.payload?.payment?.entity?.subscription_id) {
    subscriptionId = event.payload.payment.entity.subscription_id;
    status = event.event.includes("cancel")
      ? "cancelled"
      : "active";
  }

  if (!subscriptionId) {
    console.log("⚠️ No subscriptionId found, skipping DB save");
    return res.status(200).json({ status: "ignored" });
  }

  await Subscription.findOneAndUpdate(
    { subscriptionId },
    {
      subscriptionId,
      planId,
      status,
      paymentMethod: "upi",
    },
    { upsert: true }
  );

  console.log("✅ Subscription saved:", subscriptionId);

  return res.status(200).json({ status: "ok" });
}
