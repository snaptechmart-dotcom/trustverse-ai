import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import { History } from "@/app/models/History";
import User from "@/app/models/User";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { userId, name, info, score, analysis } = await req.json();

    if (!userId) {
      return NextResponse.json({ success: false, message: "User ID missing" });
    }

    const saveHistory = await History.create({
      userId,
      name,
      info,
      score,
      analysis,
    });

    // Update user trust-check usage
    await User.findByIdAndUpdate(userId, {
      $inc: { trustChecksUsed: 1 },
    });

    return NextResponse.json({ success: true, history: saveHistory });
  } catch (err) {
    console.error("PHONE CHECK ERROR:", err);
    return NextResponse.json({ success: false, error: "Server error" });
  }
}
