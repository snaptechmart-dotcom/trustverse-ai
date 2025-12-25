import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await dbConnect();

    // ⚠️ TEMP: email hard session se mat lo
    const email = "harsh2026@gmail.com"; // 👈 DEBUG PURPOSE

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // 🔴 CREDIT CHECK
    if (user.credits <= 0) {
      return NextResponse.json(
        { error: "No credits left" },
        { status: 402 }
      );
    }

    // 🔻 DEDUCT CREDIT
    user.credits -= 1;
    await user.save();

    const { text } = await req.json();

    if (!text) {
      return NextResponse.json(
        { error: "Input required" },
        { status: 400 }
      );
    }

    // 🧠 DEMO RESULT
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
  } catch (err) {
    console.error("TRUST SCORE API ERROR:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
