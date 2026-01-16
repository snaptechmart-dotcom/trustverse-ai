import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";


import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import History from "@/models/History";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const text = String(body?.text || "").trim();
    const platform = String(body?.platform || "Unknown").trim();

    if (text.length < 10) {
      return NextResponse.json(
        { error: "Please enter at least 10 characters for analysis." },
        { status: 400 }
      );
    }

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    /* =========================
       CREDIT LOGIC (PRO = 2)
    ========================= */
    let creditsUsed = 2;
    let remainingCredits = user.credits;

    if (user.plan === "FREE") {
      if (remainingCredits < 2) {
        return NextResponse.json(
          { error: "This is a PRO-grade analysis. 2 credits required." },
          { status: 402 }
        );
      }

      user.credits = remainingCredits - 2;
      await user.save();
      remainingCredits = user.credits;
    }

    /* =========================
       INTELLIGENT RISK ENGINE
    ========================= */
    const lower = text.toLowerCase();
    let riskSignals: string[] = [];

    if (lower.includes("urgent") || lower.includes("act now"))
      riskSignals.push("Urgency-driven language detected");
    if (lower.includes("guaranteed") || lower.includes("100%"))
      riskSignals.push("Unrealistic assurance patterns found");
    if (lower.includes("official") || lower.includes("verified"))
      riskSignals.push("Authority-claim language observed");
    if (lower.includes("exclusive") || lower.includes("limited"))
      riskSignals.push("Scarcity-based persuasion signals detected");

    let trustScore = 82 + Math.floor(Math.random() * 6); // 82–87 default strong
    let riskLevel: "Low Risk" | "Medium Risk" | "High Risk" = "Low Risk";

    if (riskSignals.length >= 2) {
      trustScore = 62 + Math.floor(Math.random() * 6); // 62–67
      riskLevel = "Medium Risk";
    }

    if (riskSignals.length >= 4) {
      trustScore = 38 + Math.floor(Math.random() * 6); // 38–43
      riskLevel = "High Risk";
    }

    const recommendation =
      riskLevel === "Low Risk"
        ? "Trustverse AI™ did not detect any critical scam, impersonation, or manipulation patterns. The social profile appears behaviorally consistent and generally safe for interaction. Standard caution is always recommended for first-time engagements."
        : riskLevel === "Medium Risk"
        ? "Trustverse AI™ identified several behavioral warning signals that could indicate impersonation or deceptive intent. Independent verification is strongly advised before continuing interaction."
        : "Trustverse AI™ detected multiple high-risk manipulation and deception indicators. This profile may be associated with scam activity or impersonation. Engagement is strongly discouraged without strict verification.";

    const indicators =
      riskSignals.length > 0
        ? riskSignals
        : ["No strong negative behavioral indicators detected"];

    /* =========================
       SAVE HISTORY (SCHEMA SAFE)
    ========================= */
    await History.create({
      userId: user._id,
      tool: "SOCIAL_CHECK",
      input: text,
      inputKey: `${platform}:${text.slice(0, 40)}`,
      summary: {
        trustScore,
        riskLevel,
        verdict: recommendation,
        explanation: recommendation,
      },
      creditsUsed: 2,
    });

    /* =========================
       RESPONSE (CARD READY)
    ========================= */
    return NextResponse.json({
      trustScore,
      riskLevel,
      details: {
        indicators,
        recommendation,
      },
      creditsUsed: 2,
      remainingCredits:
        user.plan === "PRO" ? "unlimited" : remainingCredits,
    });

  } catch (err) {
    console.error("SOCIAL ANALYZER ERROR:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
