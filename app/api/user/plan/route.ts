import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";

import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { userId } = await req.json();

    const user = await User.findOne({ _id: userId });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      plan: user.plan || "free",
      tokensUsed: user.tokensUsed || 0,
    });
  } catch (error) {
    console.error("User Plan Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
