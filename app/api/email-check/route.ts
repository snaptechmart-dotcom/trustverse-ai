import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";


import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import History from "@/models/History";

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
    const email = String(body?.text || "").trim().toLowerCase();

    if (
      !email ||
      !email.includes("@") ||
      !email.includes(".")
    ) {
      return NextResponse.json(
        { error: "Valid email address is required" },
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
       CREDITS – SINGLE SOURCE
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
       SUMMARY (STANDARD FORMAT)
    ========================= */
    const summary = {
      trustScore,
      riskLevel,
      verdict,
    };

    /* =========================
       SAVE HISTORY (POWER HOUSE)
    ========================= */
    await History.create({
      userId: user._id,
      tool: "EMAIL_CHECK",
      input: email,
      inputKey: email,
      summary,
      creditsUsed,
    });

    /* =========================
       RESPONSE
    ========================= */
    return NextResponse.json({
      trustScore,
      riskLevel,
      verdict,
      creditsUsed,
      remainingCredits:
        user.plan === "PRO" ? "unlimited" : remainingCredits,
    });
  } catch (error) {
    console.error("EMAIL CHECK API ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
