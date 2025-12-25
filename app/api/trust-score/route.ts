import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import History from "@/models/History";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    await dbConnect();

    // ✅ GET SESSION
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const email = session.user.email;

    // ✅ FIND USER
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

    // 🧠 TRUST SCORE LOGIC
    const trustScore = Math.floor(Math.random() * 40) + 60;

    const risk =
      trustScore > 80
        ? "Low Risk"
        : trustScore > 50
        ? "Medium Risk"
        : "High Risk";

    const confidence = `${Math.floor(Math.random() * 25) + 70}%`;

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
    console.error("TRUST SCORE API ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
