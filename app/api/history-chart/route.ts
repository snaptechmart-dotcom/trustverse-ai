import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import History from "@/models/History";





export async function GET() {
  try {
    await connectDB();

   const allHistory = await (History as any).find({}).lean();


    return NextResponse.json({ success: true, history });
  } catch (err) {
    console.error("HISTORY CHART ERROR:", err);
    return NextResponse.json({ success: false, error: "Server error" });
  }
}
