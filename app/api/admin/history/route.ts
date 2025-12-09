import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import { History } from "@/models/History";

export async function GET() {
  try {
    await connectDB();

    // ⭐ HISTORY MODEL अब CALLABLE है
    const allHistory = await History.find({}).lean();

    return NextResponse.json(allHistory);
  } catch (error) {
    console.error("HISTORY API ERROR:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
