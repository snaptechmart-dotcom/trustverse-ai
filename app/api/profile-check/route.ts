import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";

import User from "@/models/User";
import { saveActivity } from "@/lib/saveActivity";

/**
 * Profile Trust Checker
 * Inputs: name, email, phone (optional)
 * Output: trustScore, riskLevel
 */

export async function POST(req: Request) {
  try {
    // 1️⃣ DB CONNECT
    await dbConnect();

    // 2️⃣ AUTH CHECK
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !session.user.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 3️⃣ INPUT
    const { name, email, phone } = await req.json();
    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and Email are required" },
        { status: 400 }
      );
    }

    // 4️⃣ USER FETCH
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // 5️⃣ CREDIT LOGIC
    let remainingCredits = user.credits;

    if (user.plan === "FREE") {
      if (remainingCredits <= 0) {
        return NextResponse.json(
          { error: "No credits left" },
          { status: 402 }
        );
      }

      remainingCredits -= 1;
      user.credits = remainingCredits;
      await user.save();
    }

    // 6️⃣ SIMPLE TRUST SCORE LOGIC (DEMO)
    let trustScore = 70;

    if (email.endsWith("@gmail.com") || email.endsWith("@company.com")) {
      trustScore += 10;
    }

    if (phone) {
      trustScore += 5;
    }

    if (trustScore > 100) trustScore = 100;

    let riskLevel: "Low Risk" | "Medium Risk" | "High Risk" = "Medium Risk";
    if (trustScore >= 80) riskLevel = "Low Risk";
    if (trustScore < 50) riskLevel = "High Risk";

    await saveActivity({
  userEmail: session.user.email,
  tool: "PROFILE_TRUST", // ✅ enum match
  input: `${name} | ${email}${phone ? " | " + phone : ""}`,
  riskLevel,
  trustScore,
  resultSummary: `Profile trust risk: ${riskLevel}`,
});


    // 8️⃣ RESPONSE
    return NextResponse.json({
      status: "Checked",
      name,
      email,
      phone: phone || "Not provided",
      trustScore,
      riskLevel,
      remainingCredits:
        user.plan === "PRO" ? "unlimited" : remainingCredits,
    });

  } catch (err) {
    console.error("PROFILE CHECK ERROR:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
