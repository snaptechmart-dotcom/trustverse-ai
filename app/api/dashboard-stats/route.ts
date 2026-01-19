import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";

export async function GET() {
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

    const userId = session.user.id;

    /* =========================
       DASHBOARD COUNTS (SOURCE OF TRUTH)
    ========================= */

    const [
      totalReports,
      trustScoreChecks,
      phoneVerifications,
    ] = await Promise.all([
      // 🔢 All tools
      prisma.history.count({
        where: { userId },
      }),

      // 🧠 Trust Score
      prisma.history.count({
        where: {
          userId,
          tool: "TRUST_SCORE",
        },
      }),

      // 📞 Phone Checker
      prisma.history.count({
        where: {
          userId,
          tool: "phone_checker",
        },
      }),
    ]);

    /* =========================
       RESPONSE
    ========================= */
    return NextResponse.json({
      totalReports,
      trustScoreChecks,
      phoneVerifications,
    });

  } catch (error) {
    console.error("DASHBOARD STATS ERROR:", error);
    return NextResponse.json(
      { error: "Failed to load dashboard stats" },
      { status: 500 }
    );
  }
}
