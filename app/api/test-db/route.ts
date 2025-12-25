import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Subscription from "@/models/Subscription";

export async function GET() {
  try {
    console.log("TEST-DB: starting");

    await dbConnect();
    console.log("TEST-DB: db connected");

    const test = await Subscription.create({
      subscriptionId: "test_sub_" + Date.now(),
      status: "active",
      paymentMethod: "upi",
    });

    console.log("TEST-DB: created", test._id);

    return NextResponse.json({ ok: true, test });
  } catch (err: any) {
    console.error("TEST-DB ERROR FULL:", err);
    return NextResponse.json(
      {
        error: err?.message,
        name: err?.name,
        stack: err?.stack,
      },
      { status: 500 }
    );
  }
}
