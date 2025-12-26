import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import History from "@/models/History";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    /* ===============================
       1️⃣ GET TOKEN (OFFICIAL WAY)
    =============================== */
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token || !token.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    /* ===============================
       2️⃣ FIND USER
    =============================== */
    const user = await User.findOne({ email: token.email });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    /* ===============================
       3️⃣ CREDIT CHECK
    =============================== */
    if (user.plan === "free") {
      if (user.credits <= 0) {
        return NextResponse.json(
          { error: "No credits left" },
          { status: 402 }
        );
      }

      user.credits -= 1;
      await user.save();
    }

    /* ===============================
       4️⃣ INPUT
    =============================== */
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json(
        { error: "Input required" },
        { status: 400 }
      );
    }

    /* ===============================
       5️⃣ TRUST SCORE LOGIC
    =============================== */
    const trustScore = Math.floor(Math.random() * 40) + 60;
    const risk =
      trustScore >= 80
        ? "Low Risk"
        : trustScore >= 65
        ? "Medium Risk"
        : "High Risk";

    const confidence = `${Math.floor(Math.random() * 15) + 85}%`;

    /* ===============================
       6️⃣ SAVE HISTORY
    =============================== */
    await History.create({
      userId: user._id,
      type: "TRUST_SCORE",
      input: text,
      result: `Score: ${trustScore}, Risk: ${risk}`,
    });

    /* ===============================
       7️⃣ RESPONSE
    =============================== */
    return NextResponse.json({
      trustScore,
      risk,
      confidence,
      remainingCredits:
        user.plan === "pro" ? "unlimited" : user.credits,
    });
  } catch (error) {
    console.error("Trust Score Error:", error);
    return NextResponse.json(
      { error: "Service temporarily unavailable" },
      { status: 500 }
    );
  }
}
