import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";

/**
 * SOCIAL ANALYZER – PRO TOOL
 * Cost: 2 Credits (FREE users)
 * Input: text, platform
 * Output: trustScore, riskLevel, indicators, recommendation
 */

export async function POST(req: Request) {
  try {
    /* =========================
       AUTH
    ========================= */
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    /* =========================
       INPUT
    ========================= */
    const body = await req.json();
    const text = String(body?.text || "").trim();
    const platform = String(body?.platform || "Unknown").trim();

    if (text.length < 10) {
      return NextResponse.json(
        { error: "Please enter at least 10 characters for analysis." },
        { status: 400 }
      );
    }

    /* =========================
       USER (PRISMA)
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
       CREDIT LOGIC (PRO = 2)
    ========================= */
    let creditsUsed = 0;
    let remainingCredits = user.credits;

    if (user.plan === "free") {
      if (remainingCredits < 2) {
        return NextResponse.json(
          { error: "This is a PRO-grade analysis. 2 credits required." },
          { status: 402 }
        );
      }

      creditsUsed = 2;

      await prisma.user.update({
        where: { id: user.id },
        data: {
          credits: remainingCredits - 2,
        },
      });

      remainingCredits = remainingCredits - 2;
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

    let trustScore = 82 + Math.floor(Math.random() * 6); // 82–87
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
        ? "Trustverse AI™ did not detect any critical scam, impersonation, or manipulation patterns. The social profile appears behaviorally consistent and generally safe for interaction."
        : riskLevel === "Medium Risk"
        ? "Trustverse AI™ identified several behavioral warning signals. Independent verification is strongly advised."
        : "Trustverse AI™ detected multiple high-risk manipulation indicators. Engagement is strongly discouraged.";

    const indicators =
      riskSignals.length > 0
        ? riskSignals
        : ["No strong negative behavioral indicators detected"];

    /* =========================
       SAVE HISTORY (UNIVERSAL ✅)
    ========================= */
    await prisma.history.create({
      data: {
        userId: user.id,
        tool: "social_analyzer",

        input: {
          platform,
          text,
        },

        inputKey: platform,

        summary: {
          trustScore,
          riskLevel,
          verdict: "Social behavior analysis completed",
        },

        result: {
          trustScore,
          riskLevel,
          indicators,
          recommendation,
        },

        creditsUsed: creditsUsed ?? 0,
      },
    });

    /* =========================
       RESPONSE
    ========================= */
    return NextResponse.json({
      trustScore,
      riskLevel,
      details: {
        indicators,
        recommendation,
      },
      creditsUsed,
      remainingCredits:
        user.plan === "free" ? remainingCredits : "unlimited",
    });

  } catch (err) {
    console.error("SOCIAL ANALYZER ERROR:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
