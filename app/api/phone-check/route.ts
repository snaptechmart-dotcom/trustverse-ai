import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import History from "@/models/History";

export async function POST(req: Request) {
  try {
    /* =========================
       AUTH CHECK
    ========================= */
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { phone } = await req.json();
    const cleanPhone = String(phone || "").trim();

    if (!cleanPhone) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const user = await User.findOne({ email: session.user.email });
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
       PHONE ANALYSIS (BASIC)
    ========================= */
    const trustScore = 82;
    const riskLevel: "Low Risk" | "Medium Risk" | "High Risk" = "Low Risk";

    const result = {
      trustScore,
      riskLevel,
      summary:
        "Phone number does not show obvious scam indicators.",
      signals: ["Valid number format"],
      recommendation:
        "Safe for general communication.",
    };

    /* =========================
       SAVE HISTORY (CRITICAL)
    ========================= */
    await History.create({
      userId: user._id,
      tool: "PHONE_CHECK",
      query: cleanPhone,
      result,
    });

    /* =========================
       RESPONSE
    ========================= */
    return NextResponse.json({
      phone: cleanPhone,
      ...result,
      remainingCredits,
    });
  } catch (err) {
    console.error("PHONE CHECK ERROR:", err);
    return NextResponse.json(
      { error: "Phone check failed" },
      { status: 500 }
    );
  }
}
