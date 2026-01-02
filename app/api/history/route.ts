import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import ActivityHistory from "@/models/ActivityHistory";

export async function GET() {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ history: [] });
    }

    const history = await ActivityHistory.find({
      userEmail: session.user.email, // 🔥 MATCH WITH saveActivity
    })
      .sort({ updatedAt: -1 })
      .limit(50)
      .lean();

    return NextResponse.json({ history });
  } catch (err) {
    console.error("HISTORY FETCH ERROR:", err);
    return NextResponse.json({ history: [] });
  }
}
