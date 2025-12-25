import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import History from "@/models/History";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await User.findOne({ email: session.user.email });

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

    // 🧠 DEMO TRUST LOGIC
    const trustScore = Math.min(
      100,
      Math.floor(Math.random() * 95) + 5
    );

    const risk =
      trustScore > 80
        ? "Low Risk"
        : trustScore > 50
        ? "Medium Risk"
        : "High Risk";

    const confidence = `${Math.floor(
      Math.random() * 30
    ) + 65}%`;

    const result = {
      trustScore,
      risk,
      confidence,
      remainingCredits: user.credits,
    };

    // 📝 SAVE HISTORY
    await History.create({
      userId: user._id,
      type: "TRUST_SCORE",
      input: text,
      result: JSON.stringify(result),
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Trust Score Error:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
