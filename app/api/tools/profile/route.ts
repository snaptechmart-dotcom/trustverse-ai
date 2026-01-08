import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { saveActivity } from "@/lib/saveActivity";

/* =========================
   PROFILE TRUST CHECK (PRO)
========================= */
export async function POST(req: Request) {
  try {
    // 1️⃣ SESSION
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2️⃣ INPUT
    const body = await req.json();
    const name = String(body?.name || "").trim();
    const email = String(body?.email || "").trim();
    const phone = String(body?.phone || "").trim();

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and Email are required" },
        { status: 400 }
      );
    }

    // 3️⃣ DB + USER
    await dbConnect();
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (user.plan !== "PRO") {
      return NextResponse.json(
        { error: "Pro plan required" },
        { status: 403 }
      );
    }

    /* =========================
       TRUST LOGIC (DYNAMIC)
    ========================= */
    let trustScore = 70 + Math.floor(Math.random() * 15); // 70–85 base
    let risk: "Low Risk" | "Medium Risk" | "High Risk" = "Low Risk";
    const reasons: string[] = [];

    // Name quality
    if (name.length < 4) {
      trustScore -= 10;
      reasons.push("Profile name is very short");
    }

    // Email patterns
    if (/(test|fake|demo|temp)/i.test(email)) {
      trustScore -= 15;
      reasons.push("Email looks temporary or test-based");
    }

    // Phone optional signal
    if (!phone) {
      trustScore -= 5;
      reasons.push("No phone number provided");
    }

    // Random uncertainty (AI-like variation)
    const noise = Math.floor(Math.random() * 8);
    trustScore -= noise;

    // Clamp score
    trustScore = Math.max(15, Math.min(95, trustScore));

    // Risk mapping
    if (trustScore < 45) risk = "High Risk";
    else if (trustScore < 70) risk = "Medium Risk";
    else risk = "Low Risk";

    if (reasons.length === 0) {
      reasons.push("Profile information appears consistent");
    }

    const advice =
      risk === "High Risk"
        ? "Avoid trusting this profile without strong independent verification."
        : risk === "Medium Risk"
        ? "Proceed carefully and verify identity through additional channels."
        : "Profile appears reasonably trustworthy for general interaction.";

    /* =========================
       SAVE HISTORY (🔥 FINAL)
    ========================= */
    await saveActivity({
      userEmail: session.user.email,
      tool: "PROFILE_CHECK",
      input: `${name} | ${email}${phone ? " | " + phone : ""}`,
      trustScore,
      riskLevel: risk,
      resultSummary: `Profile risk: ${risk}`,
      signals: reasons,
    });

    /* =========================
       RESPONSE
    ========================= */
    return NextResponse.json({
      name,
      email,
      phone: phone || "Not provided",
      trustScore,
      risk,
      reason: reasons.join(". "),
      advice,
      remainingCredits: "unlimited",
    });

  } catch (error) {
    console.error("PROFILE CHECK ERROR:", error);
    return NextResponse.json(
      { error: "Profile analysis failed" },
      { status: 500 }
    );
  }
}
