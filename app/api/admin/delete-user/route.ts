import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";

import User from "@/models/User";
import History from "@/models/History";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { userId } = await req.json();
    if (!userId) {
      return NextResponse.json({ error: "User ID missing" }, { status: 400 });
    }

    // DELETE USER (Stable version)
    await User.deleteOne({ _id: userId });

    // DELETE USER HISTORY
    await History.deleteMany({ userId });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete User Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
