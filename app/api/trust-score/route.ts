import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import History from "@/models/History";

export async function POST(req: Request) {
  try {
    // 🔐 AUTH CHECK
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const { text } = await req.json();
    if (!text) {
      return NextResponse.json(
        { error: "Text required" },
        { status: 400 }
      );
    }

    // 💳 CREDIT CHECK (FREE USERS ONLY)
    if (user.plan !== "PRO") {
      if (user.credits <= 0) {
        return NextResponse.json(
          { error: "NO_CREDITS" },
          { status: 402 }
        );
      }
      user.credits -= 1;
      await user.save();
    }

    // 🧠 TRUST SCORE LOGIC (demo)
    const trustScore = Math.min(
      100,
      Math.floor(Math.random() * 95) + 5
    );

    const scoreData = {
      trustScore,
      risk:
        trustScore > 80
          ? "Low"
          : trustScore > 50
          ? "Medium"
          : "High",
      confidence: `${Math.floor(Math.random() * 40) + 60}%`,
    };

    // 📝 SAVE HISTORY (USER-LINKED)
    await History.create({
      userId: user._id,
      prompt: text,
      response: JSON.stringify(scoreData),
      tool: "TRUST_SCORE",
    });

    return NextResponse.json({
      ...scoreData,
      remainingCredits:
        user.plan === "PRO" ? "unlimited" : user.credits,
    });
  } catch (error) {
    console.error("Trust Score Error:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
