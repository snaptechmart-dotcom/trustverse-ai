import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import Payment from "@/models/Payment";
import mongoose from "mongoose";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json([], { status: 200 });
    }

    await dbConnect();

    const userObjectId = new mongoose.Types.ObjectId(session.user.id);

    const payments = await Payment.find({
      userId: userObjectId,
    })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(payments);
  } catch (error) {
    console.error("PAYMENTS FETCH ERROR:", error);
    return NextResponse.json([], { status: 500 });
  }
}
