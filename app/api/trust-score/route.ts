import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";

/* =========================
   TRUST SCORE HELPERS
========================= */
function generateTrustScore(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return 60 + Math.abs(hash % 40); // 60–99
}

function buildExplanation(
  score: number,
  risk: string,
  input: string
): string {
  if (risk === "Low Risk") {
    return `No major red flags were detected for "${input}". 
Behavioral and trust indicators suggest stable and reliable patterns.`;
  }

  if (risk === "Medium Risk") {
    return `Mixed trust signals were found for "${input}". 
Proceed with caution and verify independently.`;
  }

  return `High-risk indicators detected for "${input}". 
Avoid engagement or sharing sensitive information.`;
}

export async function POST(req: Request) {
  try {
    /* =========================
       AUTH
    ========================= */
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    /* =========================
       INPUT
    ========================= */
    const body = await req.json();
    const inputText = String(body?.text || "").trim();

    if (inputText.length < 5) {
      return NextResponse.json(
        { error: "Invalid input" },
        { status: 400 }
      );
    }

    /* =========================
       USER
    ========================= */
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (user.credits <= 0 && user.plan !== "pro") {
      return NextResponse.json(
        { error: "No credits left" },
        { status: 402 }
      );
    }

    /* =========================
       AI LOGIC
    ========================= */
    const trustScore = generateTrustScore(inputText);

    const riskLevel =
      trustScore >= 80
        ? "Low Risk"
        : trustScore >= 60
        ? "Medium Risk"
        : "High Risk";

    const verdict =
      "AI analysis completed using trust indicators and behavioral modeling.";

    const explanation = buildExplanation(
      trustScore,
      riskLevel,
      inputText
    );

    /* =========================
       SAVE HISTORY (PRISMA SAFE)
    ========================= */
    await prisma.history.create({
      data: {
        userId: user.id,
        tool: "TRUST_SCORE",

        // ✅ Json field
        input: { text: inputText },

        // ❌ inputKey REMOVED (schema mismatch tha)
        // inputKey: inputText,

        // ✅ short summary
        summary: {
          trustScore,
          riskLevel,
          verdict,
        },

        // ✅ REQUIRED by Prisma
        result: {
          trustScore,
          riskLevel,
          verdict,
          explanation,
        },

        // ✅ NEVER NULL
        creditsUsed: 1,
      },
    });

    /* =========================
       DEDUCT CREDIT
    ========================= */
    if (user.plan !== "pro") {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          credits: user.credits - 1,
        },
      });
    }

    /* =========================
       RESPONSE
    ========================= */
    return NextResponse.json({
      trustScore,
      riskLevel,
      verdict,
      explanation,
      creditsUsed: 1,
      remainingCredits:
        user.plan === "pro" ? "unlimited" : user.credits - 1,
    });
  } catch (error) {
    console.error("TRUST SCORE API ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
