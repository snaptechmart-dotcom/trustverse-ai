import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import History from "@/models/History";

export async function GET() {
  try {
    await connectDB();

    const history = await History.find().sort({ createdAt: 1 });

    const chartData = history.map(item => ({
      date: item.createdAt,
      count: 1
    }));

    return NextResponse.json({ chartData });
  } catch (error) {
    console.error("History Chart Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
