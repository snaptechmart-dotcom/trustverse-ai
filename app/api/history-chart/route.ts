import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import History from "@/models/History";

export async function GET() {
  try {
    await connectDB();

    const history = await History.find({})
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return NextResponse.json(history);
  } catch (error) {
    console.error("HISTORY CHART ERROR:", error);
    return NextResponse.json(
      { error: "Failed to load history data" },
      { status: 500 }
    );
  }
}
