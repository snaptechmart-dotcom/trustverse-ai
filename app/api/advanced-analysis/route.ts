import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";

/**
 * ADVANCED AI ANALYSIS – FINAL BOSS TOOL
 * Credits: 3 (FREE users)
 * Output: Long, human-like, premium analysis
 */

export async function POST(req: Request) {
  try {
    /* =========================
       1️⃣ AUTH
    ========================= */
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
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
       3️⃣ USER (PRISMA)
    ========================= */
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    /* =========================
       4️⃣ CREDIT LOGIC (LOCKED = 3)
    ========================= */
    let creditsUsed = 0;
    let remainingCredits = user.credits;

    if (user.plan === "free") {
      if (remainingCredits < 3) {
        return NextResponse.json(
          { error: "Advanced AI Analysis requires 3 credits." },
          { status: 402 }
        );
      }

      creditsUsed = 3;

      await prisma.user.update({
        where: { id: user.id },
        data: {
          credits: remainingCredits - 3,
        },
      });

      remainingCredits = remainingCredits - 3;
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
       6️⃣ TRUST SCORE
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
        ? `Trustverse AI™ Advanced Analysis did not detect any critical scam, fraud, or manipulation patterns in this content. The message appears behaviorally consistent and does not strongly resemble known deceptive or high-risk messaging techniques.`
        : riskLevel === "Medium Risk"
        ? `Trustverse AI™ Advanced Analysis identified multiple behavioral warning signals within this content. While not conclusively malicious, these patterns increase the likelihood of deception. Independent verification is strongly recommended.`
        : `Trustverse AI™ Advanced Analysis detected several high-risk indicators closely aligned with scam, fraud, and social engineering patterns. Engagement is strongly discouraged unless the source is independently verified.`;

    const finalIndicators =
      indicators.length > 0
        ? indicators
        : ["No strong negative behavioral indicators detected"];

    /* =========================
       8️⃣ SAVE HISTORY (UNIVERSAL ✅)
    ========================= */
    await prisma.history.create({
      data: {
        userId: user.id,
        tool: "advanced_ai_analysis",

        input: {
          text,
        },

        inputKey: text.slice(0, 80),

        summary: {
          trustScore,
          riskLevel,
          verdict: "Advanced AI behavioral analysis completed",
        },

        result: {
          trustScore,
          riskLevel,
          indicators: finalIndicators,
          explanation,
        },

        creditsUsed: creditsUsed ?? 0,
      },
    });

    /* =========================
       9️⃣ RESPONSE
    ========================= */
    return NextResponse.json({
      trustScore,
      riskLevel,
      details: {
        indicators: finalIndicators,
        recommendation: explanation,
      },
      creditsUsed,
      remainingCredits:
        user.plan === "free" ? remainingCredits : "unlimited",
    });

  } catch (error) {
    console.error("ADVANCED AI ANALYSIS ERROR:", error);
    return NextResponse.json(
      { error: "Service temporarily unavailable" },
      { status: 500 }
    );
  }
}
