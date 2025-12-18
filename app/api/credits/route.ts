import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  await connectDB();

  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ credits: 0 });
  }

  const user = await User.findOne({ email: session.user.email });

  return NextResponse.json({
    credits: user?.credits ?? 0,
  });
}
