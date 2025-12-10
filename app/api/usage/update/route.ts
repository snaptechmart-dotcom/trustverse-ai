import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { userId, tokensUsed } = await req.json();

    const user = await User.findOneAndUpdate(
      { _id: userId },
      { $inc: { tokensUsed } },
      { new: true }
    );

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Usage Update Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
