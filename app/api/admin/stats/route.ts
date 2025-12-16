import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import History from "@/models/History";

export async function GET() {
  try {
    await dbConnect();

    const usersCount = await User.countDocuments();
    const historyCount = await History.countDocuments();

    return NextResponse.json({
      users: usersCount,
      trustEvents: historyCount,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to load admin stats" },
      { status: 500 }
    );
  }
}
