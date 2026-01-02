import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { saveActivity } from "@/lib/saveActivity";

export async function POST(req: Request) {
  try {
    // 1️⃣ DB CONNECT
    await dbConnect();

    // 2️⃣ SESSION CHECK
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 3️⃣ INPUT
    const body = await req.json();
    const text = body?.text;

    if (!text || typeof text !== "string" || text.trim().length < 5) {
      return NextResponse.json(
        { error: "Invalid input" },
        { status: 400 }
      );
    }

    // 4️⃣ USER FETCH
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // 5️⃣ CREDIT LOGIC (🔥 FINAL FIX 🔥)
    let remainingCredits = user.credits;

    if (user.plan === "FREE") {
      if (remainingCredits <= 0) {
        return NextResponse.json(
          { error: "No credits left" },
          { status: 402 }
        );
      }

      user.credits = remainingCredits - 1;
      await user.save();
      remainingCredits = user.credits;
    }

    // 6️⃣ TRUST SCORE LOGIC (DEMO)
    const trustScore = 72;
    const riskLevel = "Medium Risk";

    const summary =
      "The content shows moderate trust indicators. No strong scam patterns were detected, but caution is advised.";

    const signals = [
      "Text structure analyzed",
      "No strong scam keywords detected",
      "Moderate uncertainty present",
    ];

    // 7️⃣ SAVE ACTIVITY HISTORY
    await saveActivity({
      userEmail: session.user.email,
      tool: "TRUST_SCORE",
      input: text,
      trustScore,
      riskLevel,
      resultSummary: `Trust score ${trustScore}/100`,
      signals,
    });

    // 8️⃣ RESPONSE
    return NextResponse.json({
      trustScore,
      riskLevel,
      summary,
      signals,
      remainingCredits:
        user.plan === "PRO" ? "unlimited" : remainingCredits,
    });

  } catch (error) {
    console.error("TRUST SCORE API ERROR:", error);
    return NextResponse.json(
      { error: "Service temporarily unavailable" },
      { status: 500 }
    );
  }
}
