import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import User from "@/app/models/User";
import { History } from "@/app/models/History";

export async function GET() {
  try {
    await connectDB();

    const totalUsers = await User.countDocuments();
    const totalChecks = await History.countDocuments();

    return NextResponse.json({
      totalUsers,
      totalChecks,
    });
  } catch (error) {
    console.error("STATS API ERROR:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
