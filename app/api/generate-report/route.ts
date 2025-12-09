import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import History from "@/app/models/History";

export async function GET() {
  try {
    await connectDB();

    // रिपोर्ट के लिए पूरी history लाओ
    const allHistory = await History.find({}).lean();

    return NextResponse.json({
      success: true,
      count: allHistory.length,
      data: allHistory,
    });
  } catch (error) {
    console.error("GENERATE REPORT ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
