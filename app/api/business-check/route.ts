import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import History from "@/models/History";

export async function POST(req: Request) {
  try {
    /* =========================
       AUTH
    ========================= */
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { businessName, domain } = await req.json();
    const cleanBusiness = String(businessName || "").trim();
    const cleanDomain = String(domain || "").trim().toLowerCase();

    if (!cleanBusiness || !cleanDomain) {
      return NextResponse.json(
        { error: "Business name and domain are required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    /* =========================
       CREDITS (🔥 PRO TOOL = 2)
    ========================= */
    const creditsUsed = 2;
    let remainingCredits = user.credits;

    if (user.plan !== "PRO") {
      if (remainingCredits < creditsUsed) {
        return NextResponse.json(
          { error: "Not enough credits" },
          { status: 402 }
        );
      }

      user.credits = remainingCredits - creditsUsed;
      await user.save();
      remainingCredits = user.credits;
    }

    /* =========================
       DYNAMIC TRUST ENGINE
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

    const riskyWords = ["free", "bonus", "crypto", "loan", "investment", "win"];
    if (riskyWords.some(w => cleanDomain.includes(w))) {
      trustScore -= 20;
      signals.push("High-risk marketing keywords detected");
    } else {
      trustScore += 10;
      signals.push("No common scam keywords detected");
    }

    if (cleanDomain.endsWith(".com") || cleanDomain.endsWith(".in")) {
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
       SAVE HISTORY
    ========================= */
    await History.create({
      userId: user._id,
      tool: "BUSINESS_CHECK",
      input: `${cleanBusiness} | ${cleanDomain}`,
      inputKey: cleanDomain,
      summary: {
        trustScore,
        riskLevel,
        verdict,
      },
      creditsUsed,
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
        user.plan === "PRO" ? "Unlimited (PRO)" : remainingCredits,
    });
  } catch (error) {
    console.error("BUSINESS CHECK ERROR:", error);
    return NextResponse.json(
      { error: "Business analysis failed" },
      { status: 500 }
    );
  }
}
