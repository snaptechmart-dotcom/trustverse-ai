import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    await dbConnect();

    // ✅ OFFICIAL & SAFE WAY
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await User.findOne({
      email: session.user.email,
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (user.credits <= 0) {
      return NextResponse.json(
        { error: "No credits left" },
        { status: 402 }
      );
    }

    const body = await req.json();

    if (!body.text) {
      return NextResponse.json(
        { error: "Input required" },
        { status: 400 }
      );
    }

    // 🔻 DEDUCT CREDIT
    user.credits -= 1;
    await user.save();

    // 🧠 TRUST SCORE LOGIC
    const trustScore = Math.floor(Math.random() * 40) + 60;
    const risk =
      trustScore > 80
        ? "Low Risk"
        : trustScore > 50
        ? "Medium Risk"
        : "High Risk";

    return NextResponse.json({
      trustScore,
      risk,
      confidence: "78%",
      remainingCredits: user.credits,
    });
  } catch (error) {
    console.error("Trust Score API Error:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
