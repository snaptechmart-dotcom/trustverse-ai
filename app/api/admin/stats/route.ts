import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import History from "@/models/History";

export async function GET() {
  try {
    await connectDB();

    const totalUsers = await User.countDocuments();
    const totalHistory = await History.countDocuments();

    return NextResponse.json({
      users: totalUsers,
      history: totalHistory,
    });
  } catch (error) {
    console.error("Stats Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
