import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import History from "@/models/History";

export async function GET() {
  try {
    await connectDB();

    const data = await History.find().sort({ createdAt: -1 });

    return NextResponse.json({ report: data });
  } catch (error) {
    console.error("Report Generate Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
