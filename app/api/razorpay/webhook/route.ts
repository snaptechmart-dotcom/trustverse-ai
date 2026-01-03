import { NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/dbConnect";
import Payment from "@/models/Payment";
import User from "@/models/User";

export async function POST(req: Request) {
  await dbConnect();

  const body = await req.text();
  const signature = req.headers.get("x-razorpay-signature")!;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(body)
    .digest("hex");

  if (signature !== expectedSignature) {
    return new NextResponse("Invalid signature", { status: 400 });
  }

  const event = JSON.parse(body);

  // ✅ PAYMENT SUCCESS
  if (event.event === "payment.captured") {
    const paymentId = event.payload.payment.entity.id;

    await Payment.findOneAndUpdate(
      { razorpayPaymentId: paymentId },
      { status: "SUCCESS" }
    );
  }

  // ❌ PAYMENT FAILED
  if (event.event === "payment.failed") {
    const paymentId = event.payload.payment.entity.id;

    await Payment.findOneAndUpdate(
      { razorpayPaymentId: paymentId },
      { status: "FAILED" }
    );
  }

  return NextResponse.json({ received: true });
}
