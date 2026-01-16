import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ plan: "FREE" });
  }

  await dbConnect();
  const user = await User.findOne({ email: session.user.email }).select("plan");

  return NextResponse.json({
    plan: user?.plan || "FREE",
  });
}
