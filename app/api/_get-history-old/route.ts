import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import ToolHistory from "@/models/ToolHistory";

export async function GET() {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const history = await ToolHistory.find({
      userEmail: session.user.email,
    }).sort({ createdAt: -1 });

    return NextResponse.json(history);
  } catch (error) {
    console.error("GET HISTORY ERROR:", error);
    return NextResponse.json(
      { error: "Failed to load history" },
      { status: 500 }
    );
  }
}
