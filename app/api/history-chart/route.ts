import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import History from "@/app/models/History";

export async function GET() {
  try {
    await connectDB();

    // Chart के लिए सकोर की जानकारी
    const chartData = await History.find({})
      .select("score createdAt")
      .sort({ createdAt: 1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: chartData,
    });
  } catch (error) {
    console.error("HISTORY CHART ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
