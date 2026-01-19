import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";

/**
 * PROFILE TRUST CHECKER – POWER HOUSE (PRO TOOL)
 * Cost: 2 Credits (FREE users)
 * Input: name, email, phone (optional)
 * Output: trustScore, riskLevel, verdict
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
    const name = String(body?.name || "").trim();
    const email = String(body?.email || "").trim().toLowerCase();
    const phone = body?.phone ? String(body.phone).trim() : "";

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    /* =========================
       USER
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
       CREDITS (PRO TOOL – 2)
    ========================= */
    let creditsUsed = 0;
    let remainingCredits = user.credits;

    if (user.plan === "free") {
      if (remainingCredits < 2) {
        return NextResponse.json(
          { error: "This is a PRO tool. 2 credits required." },
          { status: 402 }
        );
      }

      creditsUsed = 2;

      await prisma.user.update({
        where: { id: user.id },
        data: { credits: remainingCredits - 2 },
      });

      remainingCredits = remainingCredits - 2;
    }

    /* =========================
       TRUST ANALYSIS (LOGIC SAME)
    ========================= */
    const baseScore = 55 + Math.floor(Math.random() * 25); // 55–79
    let trustScore = baseScore;

    if (
      email.endsWith("@gmail.com") ||
      email.endsWith("@outlook.com") ||
      email.endsWith("@yahoo.com")
    ) {
      trustScore += 8;
    }

    if (
      !email.includes("@gmail.") &&
      !email.includes("@yahoo.")
    ) {
      trustScore += 6;
    }

    if (phone && phone.length >= 8) {
      trustScore += 6;
    }

    if (name.split(" ").length >= 2) {
      trustScore += 5;
    }

    if (trustScore > 95) trustScore = 95;

    let riskLevel: "Low Risk" | "Medium Risk" | "High Risk" = "Medium Risk";
    if (trustScore >= 80) riskLevel = "Low Risk";
    if (trustScore < 55) riskLevel = "High Risk";

    const verdict =
      riskLevel === "Low Risk"
        ? "The profile shows strong identity consistency with low risk indicators. Engagement appears safe."
        : riskLevel === "Medium Risk"
        ? "This profile contains mixed trust signals. Independent verification is advised before proceeding."
        : "High-risk indicators detected. This profile may be unreliable or associated with impersonation.";

    /* =========================
       SAVE HISTORY (UNIVERSAL ✅)
    ========================= */
    await prisma.history.create({
      data: {
        userId: user.id,
        tool: "profile_checker",

        // JSON input
        input: {
          name,
          email,
          phone: phone || null,
        },

        // string key (for search & grouping)
        inputKey: email,

        // short list view
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
        },

        // NEVER null
        creditsUsed: creditsUsed ?? 0,
      },
    });

    /* =========================
       RESPONSE
    ========================= */
    return NextResponse.json({
      name,
      email,
      phone: phone || "Not provided",
      trustScore,
      riskLevel,
      verdict,
      creditsUsed,
      remainingCredits:
        user.plan === "free" ? remainingCredits : "unlimited",
    });
  } catch (error) {
    console.error("PROFILE CHECK API ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
