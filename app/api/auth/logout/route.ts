import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ success: true });
  }

  await dbConnect();

  await User.updateOne(
    { email: session.user.email },
    { $set: { activeSession: false } }
  );

  return NextResponse.json({ success: true });
}
