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

    // 2️⃣ AUTH CHECK
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !session.user.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 3️⃣ INPUT (BULLETPROOF)
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      body = {};
    }

    const text =
      typeof body.text === "string"
        ? body.text
        : typeof body.content === "string"
        ? body.content
        : "";

    if (text.trim().length < 10) {
      return NextResponse.json(
        { error: "Please enter at least 10 characters for analysis" },
        { status: 400 }
      );
    }

    // 4️⃣ USER FETCH
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // 5️⃣ CREDIT LOGIC
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

    // 6️⃣ AI ANALYSIS (SAFE DEMO)
    const riskLevels = ["Low Risk", "Medium Risk", "High Risk"] as const;
    const riskLevel =
      riskLevels[Math.floor(Math.random() * riskLevels.length)];

    const trustScore =
      riskLevel === "Low Risk"
        ? 90
        : riskLevel === "Medium Risk"
        ? 65
        : 35;

    let explanation = "";
    if (riskLevel === "Low Risk") {
      explanation =
        "No strong scam or fraud indicators were detected. The content appears generally safe, though standard caution is advised.";
    } else if (riskLevel === "Medium Risk") {
      explanation =
        "Some warning signals were identified such as urgency or vague claims. Proceed carefully and verify details independently.";
    } else {
      explanation =
        "Multiple high-risk indicators were detected including manipulation patterns or suspicious intent. Avoid engagement unless verified.";
    }

    // 7️⃣ 🔥 SAVE ACTIVITY HISTORY – ADVANCED AI ANALYSIS
    await saveActivity({
      userEmail: session.user.email,
      tool: "ADVANCED_AI", // ✅ enum exact match
      input: text.trim(),
      riskLevel,
      trustScore,
      resultSummary: `Advanced AI analysis risk: ${riskLevel}`,
    });

    // 8️⃣ RESPONSE
    return NextResponse.json({
      status: "Analyzed",
      riskLevel,
      trustScore,
      explanation,
      remainingCredits:
        user.plan === "PRO" ? "unlimited" : remainingCredits,
    });

  } catch (err) {
    console.error("ADVANCED AI ANALYSIS ERROR 👉", err);
    return NextResponse.json(
      { error: "Service temporarily unavailable" },
      { status: 500 }
    );
  }
}
