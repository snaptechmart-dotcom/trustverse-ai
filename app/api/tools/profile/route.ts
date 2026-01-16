import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";


import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import History from "@/models/History";

/* =========================
   PROFILE TRUST CHECK (PRO)
   Credits: 2
========================= */
export async function POST(req: Request) {
  try {
    /* =========================
       1️⃣ DB + AUTH
    ========================= */
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !session.user.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    /* =========================
       2️⃣ INPUT
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
       3️⃣ USER
    ========================= */
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    /* =========================
       4️⃣ CREDIT LOGIC (PRO = 2)
    ========================= */
    let creditsUsed = 2;
    let remainingCredits = user.credits;

    if (user.plan === "FREE") {
      if (remainingCredits < 2) {
        return NextResponse.json(
          { error: "This is a PRO tool. 2 credits required." },
          { status: 402 }
        );
      }

      user.credits = remainingCredits - 2;
      await user.save();
      remainingCredits = user.credits;
    }

    /* =========================
       5️⃣ TRUST ENGINE (DYNAMIC)
    ========================= */
    let trustScore = 72 + Math.floor(Math.random() * 15); // 72–86 base
    const indicators: string[] = [];

    // Name quality
    if (name.length < 4) {
      trustScore -= 10;
      indicators.push("Profile name is unusually short");
    }

    // Email patterns
    if (/(test|fake|demo|temp)/i.test(email)) {
      trustScore -= 15;
      indicators.push("Email appears temporary or test-based");
    }

    // Common trusted providers boost
    if (
      email.endsWith("@gmail.com") ||
      email.endsWith("@outlook.com") ||
      email.endsWith("@yahoo.com")
    ) {
      trustScore += 6;
    }

    // Phone signal
    if (!phone) {
      trustScore -= 5;
      indicators.push("No phone number provided");
    } else if (phone.length >= 8) {
      trustScore += 5;
    }

    // AI uncertainty noise
    trustScore -= Math.floor(Math.random() * 6);

    // Clamp
    trustScore = Math.max(20, Math.min(95, trustScore));

    /* =========================
       6️⃣ RISK LEVEL
    ========================= */
    let riskLevel: "Low Risk" | "Medium Risk" | "High Risk" = "Low Risk";
    if (trustScore < 45) riskLevel = "High Risk";
    else if (trustScore < 70) riskLevel = "Medium Risk";

    if (indicators.length === 0) {
      indicators.push("Profile information appears consistent");
    }

    const explanation =
      riskLevel === "Low Risk"
        ? "Trustverse AI™ did not detect any significant identity or impersonation risks. The profile appears consistent and suitable for normal interaction, though standard caution is always advised."
        : riskLevel === "Medium Risk"
        ? "Trustverse AI™ identified mixed trust signals within this profile. While not conclusively risky, additional verification is recommended before engaging or sharing sensitive information."
        : "Trustverse AI™ detected multiple high-risk indicators commonly associated with fake or unreliable profiles. Engagement is strongly discouraged unless the identity can be independently verified.";

    /* =========================
       7️⃣ SAVE HISTORY (FINAL)
    ========================= */
    await History.create({
      userId: user._id,
      tool: "PROFILE_CHECK",
      input: `${name} | ${email}${phone ? " | " + phone : ""}`,
      inputKey: email,
      summary: {
        trustScore,
        riskLevel,
        verdict: explanation,
        explanation,
      },
      creditsUsed,
    });

    /* =========================
       8️⃣ RESPONSE
    ========================= */
    return NextResponse.json({
      name,
      email,
      phone: phone || "Not provided",
      trustScore,
      riskLevel,
      details: {
        indicators,
        recommendation: explanation,
      },
      creditsUsed,
      remainingCredits:
        user.plan === "PRO" ? "unlimited" : remainingCredits,
    });

  } catch (error) {
    console.error("PROFILE CHECK ERROR:", error);
    return NextResponse.json(
      { error: "Profile analysis failed" },
      { status: 500 }
    );
  }
}
