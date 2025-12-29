import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";

import User from "@/models/User";
import ToolHistory from "@/models/ToolHistory";
import TrustScoreHistory from "@/models/TrustScoreHistory";

export async function POST(req: Request) {
  try {
    // 1️⃣ DB
    await dbConnect();

    // 2️⃣ SESSION
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 3️⃣ INPUT
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json(
        { error: "Email required" },
        { status: 400 }
      );
    }

    // 4️⃣ USER
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // 5️⃣ CREDIT
    let remainingCredits = user.credits;
    if (user.plan === "FREE") {
      if (remainingCredits <= 0) {
        return NextResponse.json(
          { error: "No credits left" },
          { status: 402 }
        );
      }
      remainingCredits -= 1;
      user.credits = remainingCredits;
      await user.save();
    }

    // 6️⃣ DEMO AI RESULT
    const risks = ["Low Risk", "Medium Risk", "High Risk"] as const;
    const risk = risks[Math.floor(Math.random() * risks.length)];
    const trustScore =
      risk === "Low Risk" ? 80 : risk === "Medium Risk" ? 55 : 30;

    // 7️⃣ TOOL HISTORY (History page)
    await ToolHistory.create({
      userId: user._id,
      tool: "email-checker",
      input: { email },
      result: {
        risk,
        trustScore,
        remainingCredits:
          user.plan === "PRO" ? "unlimited" : remainingCredits,
      },
    });

    // 🔥 8️⃣ TRUST SCORE HISTORY (Dashboard count)
    await TrustScoreHistory.create({
      userId: user._id,
      input: email,
      trustScore,
      riskLevel: risk,
    });

    // 9️⃣ RESPONSE
    return NextResponse.json({
      status: "Checked",
      email,
      risk,
      trustScore,
      remainingCredits:
        user.plan === "PRO" ? "unlimited" : remainingCredits,
    });

  } catch (err) {
    console.error("EMAIL CHECK ERROR:", err);
    return NextResponse.json(
      { error: "Service temporarily unavailable" },
      { status: 500 }
    );
  }
}
