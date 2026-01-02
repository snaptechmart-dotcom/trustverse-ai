import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import ActivityHistory from "@/models/ActivityHistory";

export async function GET() {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session.user.email;

    // 🔢 TOTAL REPORTS (ALL TOOLS)
    const totalReports = await ActivityHistory.countDocuments({
      userEmail,
    });

    // 🔐 TRUST SCORE CHECKS
    const trustScoreChecks = await ActivityHistory.countDocuments({
      userEmail,
      tool: "TRUST_SCORE",
    });

    // 📞 PHONE VERIFICATIONS (FIXED)
    const phoneVerifications = await ActivityHistory.countDocuments({
      userEmail,
      tool: "PHONE_CHECK",
    });

    return NextResponse.json({
      totalReports,
      trustScoreChecks,
      phoneVerifications,
    });
  } catch (error) {
    console.error("DASHBOARD STATS ERROR 👉", error);
    return NextResponse.json(
      { error: "Failed to load dashboard stats" },
      { status: 500 }
    );
  }
}
