import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    // 🔌 DB CONNECT
    await dbConnect();

    // 📥 READ BODY
    const body = await req.json();
    const { text, userId } = body;

    // 🛑 VALIDATION (CRASH GUARD)
    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Invalid input" },
        { status: 400 }
      );
    }

    if (!userId || typeof userId !== "string") {
      return NextResponse.json(
        { error: "Invalid user" },
        { status: 401 }
      );
    }

    // 👤 FIND USER
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // 💳 CREDIT LOGIC (ATOMIC & SAFE)
    let remainingCredits = user.credits;

    if (user.plan === "free") {
      if (remainingCredits <= 0) {
        return NextResponse.json(
          { error: "No credits left" },
          { status: 402 }
        );
      }

      // 🔐 ATOMIC CREDIT DECREMENT
      const updatedUser = await User.findOneAndUpdate(
        { _id: userId, credits: { $gt: 0 } },
        { $inc: { credits: -1 } },
        { new: true }
      );

      if (!updatedUser) {
        return NextResponse.json(
          { error: "No credits left" },
          { status: 402 }
        );
      }

      remainingCredits = updatedUser.credits;
    }

    // 🤖 TRUST SCORE (SAFE DEMO)
    const trustScore = 72;
    const risk = "Medium Risk";
    const confidence = "85%";

    // ✅ FINAL RESPONSE
    return NextResponse.json({
      trustScore,
      risk,
      confidence,
      remainingCredits:
        user.plan === "pro" ? "unlimited" : remainingCredits,
    });
  } catch (error) {
    console.error("TRUST SCORE API ERROR:", error);

    return NextResponse.json(
      { error: "Service temporarily unavailable" },
      { status: 500 }
    );
  }
}
