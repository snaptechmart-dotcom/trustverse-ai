import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  console.log("🔥 BUSINESS CHECK API HIT");

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
    const cleanBusiness = String(body?.businessName || "").trim();
    const cleanDomain = String(body?.domain || "").trim().toLowerCase();

    if (!cleanBusiness || !cleanDomain) {
      return NextResponse.json(
        { error: "Business name and domain are required" },
        { status: 400 }
      );
    }

    /* =========================
       USER (PRISMA ONLY)
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
       CREDITS (PRO TOOL = 2)
    ========================= */
    const TOOL_COST = 2;
    let creditsUsed = 0;
    let remainingCredits = user.credits;

    if (user.plan === "free") {
      if (remainingCredits < TOOL_COST) {
        return NextResponse.json(
          { error: "Not enough credits" },
          { status: 402 }
        );
      }

      creditsUsed = TOOL_COST;

      await prisma.user.update({
        where: { id: user.id },
        data: {
          credits: remainingCredits - TOOL_COST,
        },
      });

      remainingCredits = remainingCredits - TOOL_COST;
    }

    /* =========================
       TRUST ENGINE (SAME LOGIC)
    ========================= */
    let trustScore = 40 + Math.floor(Math.random() * 35);
    const signals: string[] = [];

    if (cleanDomain.includes(".")) {
      trustScore += 10;
      signals.push("Valid domain structure detected");
    } else {
      trustScore -= 15;
      signals.push("Invalid or weak domain structure");
    }

    if (cleanBusiness.length >= 4) {
      trustScore += 10;
      signals.push("Business name appears complete and identifiable");
    } else {
      trustScore -= 10;
      signals.push("Business name appears weak or incomplete");
    }

    const riskyWords = [
      "free",
      "bonus",
      "crypto",
      "loan",
      "investment",
      "win",
    ];

    if (riskyWords.some(w => cleanDomain.includes(w))) {
      trustScore -= 20;
      signals.push("High-risk marketing keywords detected");
    } else {
      trustScore += 10;
      signals.push("No common scam keywords detected");
    }

    if (
      cleanDomain.endsWith(".com") ||
      cleanDomain.endsWith(".in")
    ) {
      trustScore += 5;
      signals.push("Uses commonly trusted domain extension");
    }

    trustScore = Math.max(0, Math.min(100, trustScore));

    const riskLevel =
      trustScore >= 80
        ? "Low Risk"
        : trustScore >= 50
        ? "Medium Risk"
        : "High Risk";

    const verdict =
      riskLevel === "Low Risk"
        ? "This business appears legitimate with no immediate red flags."
        : riskLevel === "Medium Risk"
        ? "Some caution is advised. Independent verification is recommended."
        : "Multiple risk indicators detected. Avoid engagement without verification.";

    /* =========================
       SAVE HISTORY (UNIVERSAL ✅)
    ========================= */
    await prisma.history.create({
      data: {
        userId: user.id,
        tool: "business_checker",

        // JSON input (standard)
        input: {
          businessName: cleanBusiness,
          domain: cleanDomain,
        },

        // string key
        inputKey: cleanDomain,

        // list view
        summary: {
          trustScore,
          riskLevel,
          verdict,
        },

        // full report
        result: {
          trustScore,
          riskLevel,
          verdict,
          signals,
        },

        // NEVER NULL
        creditsUsed: creditsUsed ?? 0,
      },
    });

    /* =========================
       RESPONSE
    ========================= */
    return NextResponse.json({
      businessName: cleanBusiness,
      domain: cleanDomain,
      trustScore,
      riskLevel,
      verdict,
      signals,
      creditsUsed,
      remainingCredits:
        user.plan === "free" ? remainingCredits : "unlimited",
    });
  } catch (error) {
    console.error("BUSINESS CHECK ERROR:", error);
    return NextResponse.json(
      { error: "Business analysis failed" },
      { status: 500 }
    );
  }
}
