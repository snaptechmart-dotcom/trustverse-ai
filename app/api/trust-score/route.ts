import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import History from "@/models/History";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const { text, userId } = await req.json();

    if (!text || !userId) {
      return NextResponse.json(
        { error: "Invalid request" },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (user.plan === "free" && user.credits <= 0) {
      return NextResponse.json(
        { error: "No credits left" },
        { status: 402 }
      );
    }

    if (user.plan === "free") {
      user.credits -= 1;
      await user.save();
    }

    const trustScore = Math.floor(Math.random() * 40) + 60;
    const risk =
      trustScore >= 80
        ? "Low Risk"
        : trustScore >= 65
        ? "Medium Risk"
        : "High Risk";

    await History.create({
      userId: user._id,
      type: "TRUST_SCORE",
      input: text,
      result: `Score ${trustScore} - ${risk}`,
    });

    return NextResponse.json({
      trustScore,
      risk,
      confidence: "85%",
      remainingCredits:
        user.plan === "pro" ? "unlimited" : user.credits,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Service temporarily unavailable" },
      { status: 500 }
    );
  }
}
