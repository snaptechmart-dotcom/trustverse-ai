import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";

import User from "@/models/User";
import History from "@/models/History";

export async function POST(req: Request) {
  try {
    // 1️⃣ Session check
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2️⃣ Body read
    const { tool, input } = await req.json();

    if (!tool || !input) {
      return NextResponse.json(
        { error: "Tool and input required" },
        { status: 400 }
      );
    }

    await connectDB();

    // 3️⃣ User fetch
    const user = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // 4️⃣ Credit check
    if (user.credits <= 0) {
      return NextResponse.json(
        { error: "Insufficient credits" },
        { status: 403 }
      );
    }

    // 5️⃣ Deduct credit
    user.credits -= 1;
    await user.save();

    // 6️⃣ Save history (AUTO)
    await History.create({
      userId: user._id,
      action: `${tool} Used`,
      impact: -1,
      reason: `Input: ${input}`,
    });

    // 7️⃣ Demo AI result (real AI later)
    let result;

    switch (tool) {
      case "trust-score":
        result = {
          trustScore: 78,
          level: "Safe",
        };
        break;

      case "phone-check":
        result = {
          valid: true,
          spamRisk: "Low",
        };
        break;

      case "social-analyzer":
        result = {
          trustScore: 75,
          risk: "Medium",
        };
        break;

      case "advanced-ai":
        result = {
          verdict: "No high-risk signals detected",
          confidence: "High",
        };
        break;

      default:
        return NextResponse.json(
          { error: "Invalid tool" },
          { status: 400 }
        );
    }

    // 8️⃣ Success response
    return NextResponse.json({
      success: true,
      creditsLeft: user.credits,
      result,
    });

  } catch (error) {
    console.error("RUN AI ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
