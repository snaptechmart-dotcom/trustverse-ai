import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    await dbConnect();

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

    if (user.credits <= 0) {
      return NextResponse.json(
        { error: "No credits left" },
        { status: 402 }
      );
    }

    const { text } = await req.json();
    if (!text) {
      return NextResponse.json(
        { error: "Input required" },
        { status: 400 }
      );
    }

    // 🔻 Deduct credit
    user.credits -= 1;
    await user.save();

    // 🧠 Demo Trust Logic
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
    console.error("Trust Score API Error:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
