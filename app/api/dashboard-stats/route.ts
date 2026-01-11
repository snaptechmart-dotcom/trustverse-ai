import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import History from "@/models/History";

export async function GET() {
  try {
    /* =========================
       DB + AUTH
    ========================= */
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    /* =========================
       DASHBOARD COUNTS
       (SINGLE SOURCE = HISTORY)
    ========================= */

    // 🔢 TOTAL REPORTS (ALL TOOLS)
    const totalReports = await History.countDocuments({
      userId,
    });

    // 🔐 TRUST SCORE CHECKS
    const trustScoreChecks = await History.countDocuments({
      userId,
      tool: "TRUST_SCORE",
    });

    // 📞 PHONE VERIFICATIONS
    const phoneVerifications = await History.countDocuments({
      userId,
      tool: "PHONE_CHECK",
    });

    // 📧 EMAIL CHECKS
    const emailChecks = await History.countDocuments({
      userId,
      tool: "EMAIL_CHECK",
    });

    // 👤 PROFILE CHECKS
    const profileChecks = await History.countDocuments({
      userId,
      tool: "PROFILE_CHECK",
    });

    // 🏢 BUSINESS CHECKS
    const businessChecks = await History.countDocuments({
      userId,
      tool: "BUSINESS_CHECK",
    });

    // 🌐 SOCIAL ANALYZER
    const socialChecks = await History.countDocuments({
      userId,
      tool: "SOCIAL_CHECK",
    });

    // 🧠 ADVANCED AI ANALYSIS
    const advancedAI = await History.countDocuments({
      userId,
      tool: "ADVANCED_AI",
    });

    /* =========================
       RESPONSE (DASHBOARD READY)
    ========================= */
    return NextResponse.json({
      totalReports,
      trustScoreChecks,
      phoneVerifications,
      emailChecks,
      profileChecks,
      businessChecks,
      socialChecks,
      advancedAI,
    });

  } catch (error) {
    console.error("DASHBOARD STATS ERROR 👉", error);
    return NextResponse.json(
      { error: "Failed to load dashboard stats" },
      { status: 500 }
    );
  }
}
