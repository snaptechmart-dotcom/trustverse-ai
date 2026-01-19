import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";

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
    const email = String(body?.text || "")
      .trim()
      .toLowerCase();

    if (!email || !email.includes("@") || !email.includes(".")) {
      return NextResponse.json(
        { error: "Valid email address is required" },
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
       EMAIL ANALYSIS (SAFE MOCK)
    ========================= */
    const disposableDomains = [
      "tempmail",
      "10minutemail",
      "mailinator",
      "guerrillamail",
    ];

    const domain = email.split("@")[1] || "";
    const isDisposable = disposableDomains.some((d) =>
      domain.includes(d)
    );

    const trustScore = isDisposable
      ? Math.floor(30 + Math.random() * 20)   // 30–49
      : Math.floor(65 + Math.random() * 25);  // 65–89

    const riskLevel =
      trustScore >= 80
        ? "Low Risk"
        : trustScore >= 50
        ? "Medium Risk"
        : "High Risk";

    const verdict =
      riskLevel === "Low Risk"
        ? "This email appears legitimate with strong trust indicators."
        : riskLevel === "Medium Risk"
        ? "This email shows mixed trust signals. Proceed with caution."
        : "High risk detected. This email may be disposable or unsafe.";

    /* =========================
       SAVE HISTORY (UNIVERSAL ✅)
    ========================= */
    await prisma.history.create({
      data: {
        userId: user.id,
        tool: "email_checker",

        // ✅ JSON input
        input: { email },

        // ✅ string key
        inputKey: email,

        // ✅ short (history list)
        summary: {
          trustScore,
          riskLevel,
          verdict,
        },

        // ✅ full detail
        result: {
          trustScore,
          riskLevel,
          verdict,
          isDisposable,
        },

        // ✅ never null
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
      isDisposable,
      creditsUsed,
      remainingCredits:
        user.plan === "free" ? remainingCredits : "unlimited",
    });
  } catch (error) {
    console.error("EMAIL CHECK API ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
