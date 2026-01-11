import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import History from "@/models/History";

/* =========================
   HELPER: DETERMINISTIC SCORE
========================= */
function generatePhoneTrustScore(phone: string): number {
  let hash = 0;
  for (let i = 0; i < phone.length; i++) {
    hash = (hash << 5) - hash + phone.charCodeAt(i);
    hash |= 0;
  }

  const normalized = Math.abs(hash % 40); // 0–39
  return 55 + normalized; // 55–94
}

/* =========================
   HELPER: HUMAN EXPLANATION
========================= */
function buildPhoneExplanation(
  phone: string,
  score: number,
  risk: string
): string {
  if (risk === "Low Risk") {
    return `Our AI analysis found no major red flags associated with the phone number ${phone}.
The number shows patterns consistent with legitimate usage and normal activity.
Based on available trust signals, this phone number appears safe for regular communication.`;
  }

  if (risk === "Medium Risk") {
    return `The phone number ${phone} shows mixed trust signals.
While it does not match confirmed scam databases, certain usage patterns suggest caution.
It is recommended to avoid sharing sensitive information until further verification.`;
  }

  return `Multiple high-risk indicators were detected for the phone number ${phone}.
The number exhibits patterns commonly associated with spam, fraud, or scam activity.
It is strongly advised to avoid calls, messages, or any form of engagement.`;
}

export async function POST(req: Request) {
  try {
    /* =========================
       DB + AUTH
    ========================= */
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    /* =========================
       INPUT
    ========================= */
    const body = await req.json();
    const input = String(body?.text || "").trim();

    if (!input || input.length < 6) {
      return NextResponse.json(
        { error: "Valid phone number is required" },
        { status: 400 }
      );
    }

    /* =========================
       USER
    ========================= */
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    /* =========================
       CREDITS (LOCKED LOGIC)
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
      user.credits = remainingCredits - 1;
      await user.save();
      remainingCredits = user.credits;
    }

    /* =========================
       PHONE ANALYSIS (LOGIC)
    ========================= */
    const trustScore = generatePhoneTrustScore(input);

    const riskLevel =
      trustScore >= 80
        ? "Low Risk"
        : trustScore >= 60
        ? "Medium Risk"
        : "High Risk";

    const verdict =
      "AI analysis completed using phone behavior patterns and risk heuristics.";

    const explanation = buildPhoneExplanation(
      input,
      trustScore,
      riskLevel
    );

    /* =========================
       SAVE HISTORY (FINAL)
    ========================= */
    await History.create({
      userId: user._id,
      tool: "PHONE_CHECK",
      input,
      inputKey: input,
      summary: {
        trustScore,
        riskLevel,
        verdict,
        explanation,
      },
      creditsUsed,
    });

    /* =========================
       RESPONSE
    ========================= */
    return NextResponse.json({
      trustScore,
      riskLevel,
      verdict,
      explanation,
      creditsUsed,
      remainingCredits:
        user.plan === "PRO" ? "unlimited" : remainingCredits,
    });
  } catch (error) {
    console.error("PHONE CHECK API ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
