import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import History from "@/models/History";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const history = await History.find({})
      .sort({ createdAt: -1 })
      .limit(100);

    return NextResponse.json({ history });
  } catch (error) {
    console.error("ADMIN HISTORY ERROR:", error);
    return NextResponse.json(
      { error: "Failed to load history" },
      { status: 500 }
    );
  }
}
