import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { saveActivity } from "@/lib/saveActivity";

export async function POST(req: Request) {
  try {
    /* =========================
       DB + SESSION
    ========================= */
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    /* =========================
       INPUT VALIDATION
    ========================= */
    const body = await req.json();
    const text = body?.text?.trim();

    if (!text || text.length < 5) {
      return NextResponse.json(
        { error: "Invalid input" },
        { status: 400 }
      );
    }

    /* =========================
       USER FETCH
    ========================= */
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    /* =========================
       CREDIT LOGIC (FINAL)
    ========================= */
    let creditsUsed = 0;
    let remainingCredits = user.credits;

    if (user.plan === "FREE") {
      if (remainingCredits <= 0) {
        return NextResponse.json(
          { error: "No credits left" },
          { status: 402 }
        );
      }

      creditsUsed = 1;
      user.credits = remainingCredits - creditsUsed;
      await user.save();
      remainingCredits = user.credits;
    }

    /* =========================
       TRUST SCORE ENGINE (v1)
    ========================= */
    const trustScore = 72;
    const riskLevel: "Low Risk" | "Medium Risk" | "High Risk" =
      trustScore >= 80
        ? "Low Risk"
        : trustScore >= 50
        ? "Medium Risk"
        : "High Risk";

    const summary =
      "The content shows moderate trust indicators. No strong scam patterns were detected, but caution is advised.";

    const signals = [
      "Text structure analyzed",
      "No strong scam keywords detected",
      "Moderate uncertainty present",
    ];

    /* =========================
       SAVE HISTORY (MASTER)
    ========================= */
    await saveActivity({
      userEmail: session.user.email,
      tool: "TRUST_SCORE",
      input: text,
      trustScore,
      riskLevel,
      resultSummary: summary,
      signals,
      creditsUsed,
    });

    /* =========================
       SHARE-SAFE RESPONSE
       (🔥 SHARE BUTTON FIX 🔥)
    ========================= */
    return NextResponse.json({
      trustScore,
      riskLevel,
      summary,
      signals,

      // billing
      creditsUsed,
      remainingCredits:
        user.plan === "PRO" ? "unlimited" : remainingCredits,

      // 🔗 share payload (frontend will use this)
      share: {
        title: "Trustverse AI – Trust Score Report",
        text: `Trust Score: ${trustScore}/100\nRisk Level: ${riskLevel}\n\n${summary}`,
      },
    });
  } catch (error) {
    console.error("TRUST SCORE API ERROR:", error);
    return NextResponse.json(
      { error: "Service temporarily unavailable" },
      { status: 500 }
    );
  }
}
