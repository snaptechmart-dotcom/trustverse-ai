import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import { History } from "@/app/models/History";

export async function GET() {
  try {
    await connectDB();

    const history = await History.find({})
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return NextResponse.json({ success: true, history });
  } catch (err) {
    console.error("HISTORY CHART ERROR:", err);
    return NextResponse.json({ success: false, error: "Server error" });
  }
}
