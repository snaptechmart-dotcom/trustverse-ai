import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import User from "@/app/models/User";
import History from "@/app/models/History";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "userId required" },
        { status: 400 }
      );
    }

    await User.findByIdAndDelete(userId);
    await History.deleteMany({ userId });

    return NextResponse.json({ success: true, message: "User deleted" });
  } catch (error) {
    console.error("DELETE USER ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
