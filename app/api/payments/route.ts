import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Payment from "@/models/Payment";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json([], { status: 401 });
  }

  await dbConnect();

  const payments = await Payment.find({
    userId: session.user.id,
  }).sort({ createdAt: -1 });

  return NextResponse.json(payments);
}
