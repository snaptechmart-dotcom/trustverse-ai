import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/dbConnect";
import Subscription from "@/models/Subscription";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  const test = await Subscription.create({
    subscriptionId: "test_sub_123",
    status: "active",
    paymentMethod: "upi",
  });

  return res.status(200).json({ ok: true, test });
}
