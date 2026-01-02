import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";

import User from "@/models/User";
import { saveActivity } from "@/lib/saveActivity";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const email = String(body?.email || "").trim();

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 🔐 CREDIT HANDLING (FREE vs PRO)
    let remainingCredits = user.credits;

    if (user.plan === "FREE") {
      if (remainingCredits <= 0) {
        return NextResponse.json(
          { error: "No credits left" },
          { status: 402 }
        );
      }

      user.credits -= 1;
      await user.save();
      remainingCredits = user.credits;
    }

    // 🔍 ANALYSIS RESULT (TEMP / MOCK)
    const riskLevel = "Low Risk";
    const trustScore = 78;

    // 🔥 SAVE ACTIVITY HISTORY – EMAIL CHECKER (FINAL)
    await saveActivity({
      userEmail: session.user.email,
      tool: "EMAIL_CHECK",
      input: email,
      riskLevel,
      trustScore,
      resultSummary: `Email risk: ${riskLevel}`,
    });

    // ✅ RESPONSE
    return NextResponse.json({
      email,
      trustScore,
      riskLevel,
      remainingCredits:
        user.plan === "PRO" ? "unlimited" : remainingCredits,
    });
  } catch (error) {
    console.error("EMAIL CHECK ERROR 👉", error);
    return NextResponse.json(
      { error: "Service temporarily unavailable" },
      { status: 500 }
    );
  }
}
