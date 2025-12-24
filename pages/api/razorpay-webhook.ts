import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import dbConnect from "@/lib/dbConnect";
import Subscription from "@/models/Subscription";

export const config = {
  api: {
    bodyParser: false, // 🔴 VERY IMPORTANT
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

  if (event.event?.startsWith("subscription.")) {
    const sub = event.payload.subscription.entity;

    await Subscription.findOneAndUpdate(
      { subscriptionId: sub.id },
      {
        subscriptionId: sub.id,
        planId: sub.plan_id,
        status: sub.status,
        paymentMethod: sub.payment_method || "upi",
        userEmail:
          sub.customer_email ||
          sub.notes?.email ||
          "unknown",
      },
      { upsert: true }
    );
  }

  return res.status(200).json({ status: "ok" });
}
