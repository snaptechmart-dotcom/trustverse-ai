// app/api/admin/history/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb"; // ya relative path agar alias nahi chal raha: ../../lib/mongodb
import History from "@/app/models/History";     // <-- same path as file above

export async function GET() {
  try {
    await connectDB();

    // TypeScript-safe: History is a Model so find() is callable
    const allHistory = await History.find({}).lean();

    return NextResponse.json(allHistory);
  } catch (error) {
    console.error("HISTORY API ERROR:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
