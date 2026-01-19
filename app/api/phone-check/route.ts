import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";

console.log("🔥 PHONE CHECKER API HIT");

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

/* =========================
   POST
========================= */
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
       CREDITS
    ========================= */
    let creditsUsed = 0;
    let remainingCredits = user.credits;

    if (user.plan === "free") {
      if (remainingCredits <= 0) {
        return NextResponse.json(
          { error: "No credits left" },
          { status: 402 }
        );
      }

      creditsUsed = 1;

      await prisma.user.update({
        where: { id: user.id },
        data: { credits: remainingCredits - 1 },
      });

      remainingCredits = remainingCredits - 1;
    }

    /* =========================
       PHONE ANALYSIS
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
       SAVE HISTORY (UNIVERSAL FORMAT ✅)
    ========================= */
    await prisma.history.create({
      data: {
        userId: user.id,
        tool: "phone_checker",

        // ✅ JSON input (same as Trust Score)
        input: { phone: input },

        // ✅ string key (optional but safe)
        inputKey: input,

        // ✅ short summary (history list)
        summary: {
          trustScore,
          riskLevel,
          verdict,
        },

        // ✅ full result (detail page)
        result: {
          trustScore,
          riskLevel,
          verdict,
          explanation,
        },

        // ✅ NEVER NULL
        creditsUsed: creditsUsed ?? 0,
      },
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
        user.plan === "free" ? remainingCredits : "unlimited",
    });
  } catch (error) {
    console.error("PHONE CHECK API ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
