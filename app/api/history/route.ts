import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import ToolHistory from "@/models/ToolHistory";

export async function GET() {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const history = await ToolHistory.find({
      userId: session.user.id,
    })
      .sort({ createdAt: -1 })
      .limit(50);

    return NextResponse.json(history);
  } catch (err) {
    console.error("HISTORY FETCH ERROR:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
