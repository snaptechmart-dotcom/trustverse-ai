import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import History from "@/models/History";

export async function GET() {
  try {
    await connectDB();
    const history = await History.find().sort({ createdAt: -1 });
    return NextResponse.json({ history });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
