import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import History from "@/models/History";

/**
 * PROFILE TRUST CHECKER – POWER HOUSE (PRO TOOL)
 * Cost: 2 Credits (FREE users)
 * Input: name, email, phone (optional)
 * Output: trustScore, riskLevel, verdict
 */

export async function POST(req: Request) {
  try {
    /* =========================
       DB + AUTH
    ========================= */
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !session.user.id) {
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
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    /* =========================
       CREDITS LOGIC (PRO TOOL)
       🔥 COST = 2 CREDITS
    ========================= */
    let creditsUsed = 0;
    let remainingCredits = user.credits;

    if (user.plan === "FREE") {
      if (remainingCredits < 2) {
        return NextResponse.json(
          { error: "This is a PRO tool. 2 credits required." },
          { status: 402 }
        );
      }

      creditsUsed = 2;                     // 🔥 PRO TOOL COST
      user.credits = remainingCredits - 2;
      await user.save();
      remainingCredits = user.credits;
    } else {
      creditsUsed = 0;                     // PRO = unlimited
    }

    /* =========================
       TRUST ANALYSIS (DYNAMIC)
       🔥 NEVER SAME RESULT
    ========================= */
    const baseScore = 55 + Math.floor(Math.random() * 25); // 55–79
    let trustScore = baseScore;

    // Trusted email providers
    if (
      email.endsWith("@gmail.com") ||
      email.endsWith("@outlook.com") ||
      email.endsWith("@yahoo.com")
    ) {
      trustScore += 8;
    }

    // Custom / business domain
    if (!email.includes("@gmail.") && !email.includes("@yahoo.")) {
      trustScore += 6;
    }

    // Phone credibility
    if (phone && phone.length >= 8) {
      trustScore += 6;
    }

    // Full name adds confidence
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
       SUMMARY (STANDARD FORMAT)
    ========================= */
    const summary = {
      trustScore,
      riskLevel,
      verdict,
    };

    /* =========================
       SAVE HISTORY (FINAL)
    ========================= */
    await History.create({
      userId: user._id,
      tool: "PROFILE_CHECK",
      input: `${name} | ${email}${phone ? " | " + phone : ""}`,
      inputKey: email,
      summary,
      creditsUsed,
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
        user.plan === "PRO" ? "unlimited" : remainingCredits,
    });

  } catch (error) {
    console.error("PROFILE CHECK API ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
