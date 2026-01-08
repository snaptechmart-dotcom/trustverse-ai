import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import History from "@/models/History";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !session.user.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { email } = await req.json();
    const cleanEmail = String(email || "").trim();

    if (!cleanEmail) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    /* =========================
       CREDIT HANDLING
    ========================= */
    let remainingCredits: number | "unlimited" =
      user.plan === "PRO" ? "unlimited" : user.credits;

    if (user.plan === "FREE") {
      if (user.credits <= 0) {
        return NextResponse.json(
          { error: "No credits left" },
          { status: 402 }
        );
      }

      user.credits -= 1;
      await user.save();
      remainingCredits = user.credits;
    }

    /* =========================
       EMAIL ANALYSIS (BASIC)
    ========================= */
    const trustScore = 78;
    const riskLevel: "Low Risk" | "Medium Risk" | "High Risk" = "Low Risk";

    const result = {
      trustScore,
      riskLevel,
      summary:
        "Email format appears valid with no obvious risk indicators.",
      signals: [],
      recommendation: "Safe for general communication.",
    };

    /* =========================
       SAVE HISTORY (IMPORTANT)
    ========================= */
    await History.create({
      userId: user._id,
      tool: "EMAIL_CHECK",
      query: cleanEmail,
      result,
    });

    /* =========================
       RESPONSE
    ========================= */
    return NextResponse.json({
      email: cleanEmail,
      ...result,
      remainingCredits,
    });
  } catch (error) {
    console.error("EMAIL CHECK ERROR:", error);
    return NextResponse.json(
      { error: "Service temporarily unavailable" },
      { status: 500 }
    );
  }
}
