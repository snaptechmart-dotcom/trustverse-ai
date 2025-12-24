import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import TrustScoreHistory from "@/models/TrustScoreHistory";
import User from "@/models/User";
import { canAccessFullHistory } from "@/lib/planGuard";

export async function GET() {
  // 🔐 IMPORTANT: authOptions pass karna mandatory hai
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  await dbConnect();

  const user = await User.findById(session.user.id);
  if (!user) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    );
  }

  let history = await TrustScoreHistory.find({
    userId: session.user.id,
  })
    .sort({ createdAt: -1 })
    .limit(50);

  // 🔒 Free plan users ko limited history
  if (!canAccessFullHistory(user)) {
    history = history.slice(0, 3);
  }

  return NextResponse.json(history);
}
