import ToolHistory from "@/models/ToolHistory";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    // 🔌 DB CONNECT
    await dbConnect();

    // 🔐 SESSION CHECK (🔥 FIX 🔥)
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 📥 READ BODY
    const { text } = await req.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Invalid input" },
        { status: 400 }
      );
    }

    // 👤 FIND USER
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // 💳 CREDIT LOGIC
    let remainingCredits = user.credits;

    if (user.plan === "free") {
      if (remainingCredits <= 0) {
        return NextResponse.json(
          { error: "No credits left" },
          { status: 402 }
        );
      }

      user.credits -= 1;
      await user.save();
      remainingCredits = user.credits;
    }

    // 🤖 TRUST SCORE (DEMO)
    const trustScore = 72;
    const riskLevel = "Medium Risk";
    const confidence = "85%";

    // 🧾 SAVE HISTORY
    await ToolHistory.create({
      userId: user._id,
      tool: "trust-score",
      input: { text },
      result: {
        trustScore,
        riskLevel,
        confidence,
        remainingCredits:
          user.plan === "pro" ? "unlimited" : remainingCredits,
      },
    });

    // ✅ RESPONSE
    return NextResponse.json({
      trustScore,
      riskLevel,
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
