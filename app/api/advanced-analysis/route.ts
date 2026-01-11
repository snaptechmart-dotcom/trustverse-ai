import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import History from "@/models/History";

/**
 * ADVANCED AI ANALYSIS – FINAL BOSS TOOL
 * Credits: 3 (FREE users)
 * Output: Long, human-like, premium analysis
 */
export async function POST(req: Request) {
  try {
    /* =========================
       1️⃣ DB + AUTH
    ========================= */
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    /* =========================
       2️⃣ INPUT
    ========================= */
    const body = await req.json();
    const text = String(body?.text || body?.content || "").trim();

    if (text.length < 10) {
      return NextResponse.json(
        { error: "Please enter at least 10 characters for analysis." },
        { status: 400 }
      );
    }

    /* =========================
       3️⃣ USER
    ========================= */
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    /* =========================
       4️⃣ CREDIT LOGIC (LOCKED = 3)
    ========================= */
    let creditsUsed = 3;
    let remainingCredits = user.credits;

    if (user.plan === "FREE") {
      if (remainingCredits < 3) {
        return NextResponse.json(
          { error: "Advanced AI Analysis requires 3 credits." },
          { status: 402 }
        );
      }

      user.credits = remainingCredits - 3;
      await user.save();
      remainingCredits = user.credits;
    }

    /* =========================
       5️⃣ ADVANCED AI ENGINE
    ========================= */
    const lower = text.toLowerCase();
    const indicators: string[] = [];
    let riskScore = 0;

    if (lower.includes("urgent") || lower.includes("act now")) {
      indicators.push("Urgency-based pressure language detected");
      riskScore += 2;
    }

    if (
      lower.includes("guaranteed") ||
      lower.includes("100%") ||
      lower.includes("instant profit")
    ) {
      indicators.push("Unrealistic financial or outcome promises detected");
      riskScore += 2;
    }

    if (
      lower.includes("official") ||
      lower.includes("verified") ||
      lower.includes("government")
    ) {
      indicators.push("Authority or impersonation-style claims detected");
      riskScore += 1;
    }

    if (
      lower.includes("limited time") ||
      lower.includes("last chance") ||
      lower.includes("exclusive")
    ) {
      indicators.push("Emotional manipulation patterns detected");
      riskScore += 1;
    }

    if (
      lower.includes("send money") ||
      lower.includes("payment") ||
      lower.includes("transfer")
    ) {
      indicators.push("Direct financial request language detected");
      riskScore += 2;
    }

    /* =========================
       6️⃣ TRUST SCORE (DYNAMIC)
    ========================= */
    let trustScore =
      riskScore >= 6
        ? 30 + Math.floor(Math.random() * 10)   // 30–39
        : riskScore >= 3
        ? 55 + Math.floor(Math.random() * 10)   // 55–64
        : 80 + Math.floor(Math.random() * 10);  // 80–89

    let riskLevel: "Low Risk" | "Medium Risk" | "High Risk" =
      trustScore >= 75
        ? "Low Risk"
        : trustScore >= 50
        ? "Medium Risk"
        : "High Risk";

    /* =========================
       7️⃣ LONG HUMAN EXPLANATION
    ========================= */
    const explanation =
      riskLevel === "Low Risk"
        ? `Trustverse AI™ Advanced Analysis did not detect any critical scam, fraud, or manipulation patterns in this content. The message appears behaviorally consistent and does not strongly resemble known deceptive or high-risk messaging techniques. While the overall risk is low, users are still encouraged to apply standard caution when interacting with unknown individuals or sources online.`
        : riskLevel === "Medium Risk"
        ? `Trustverse AI™ Advanced Analysis identified multiple behavioral warning signals within this content. These include urgency-driven language, persuasive framing, or exaggerated claims that are commonly used in misleading or manipulative messaging. Although this does not confirm malicious intent, the presence of such patterns increases the likelihood of deception. Independent verification is strongly recommended before any form of engagement or financial action.`
        : `Trustverse AI™ Advanced Analysis detected several high-risk indicators that closely align with known scam, fraud, and social engineering patterns. These include strong pressure tactics, manipulation language, and potential financial exploitation signals. This content poses a significant risk, and engagement is strongly discouraged unless the source can be conclusively verified through trusted and independent channels.`;

    const finalIndicators =
      indicators.length > 0
        ? indicators
        : ["No strong negative behavioral indicators detected"];

    /* =========================
       8️⃣ SAVE HISTORY (SCHEMA PERFECT)
    ========================= */
    await History.create({
      userId: user._id,
      tool: "ADVANCED_AI",
      input: text,
      inputKey: text.slice(0, 80),
      summary: {
        trustScore,
        riskLevel,
        verdict: explanation,
        explanation,
      },
      creditsUsed: 3,
    });

    /* =========================
       9️⃣ RESPONSE (UI READY)
    ========================= */
    return NextResponse.json({
      trustScore,
      riskLevel,
      details: {
        indicators: finalIndicators,
        recommendation: explanation,
      },
      creditsUsed: 3,
      remainingCredits:
        user.plan === "PRO" ? "unlimited" : remainingCredits,
    });

  } catch (error) {
    console.error("ADVANCED AI ANALYSIS ERROR:", error);
    return NextResponse.json(
      { error: "Service temporarily unavailable" },
      { status: 500 }
    );
  }
}
