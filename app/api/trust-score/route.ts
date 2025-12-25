import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  console.log("🔵 TRUST SCORE API HIT");

  try {
    await dbConnect();
    console.log("🟢 DB CONNECTED");

    const session = await getServerSession(authOptions);
    console.log("🟡 SESSION:", session);

    if (!session || !session.user || !session.user.email) {
      console.log("🔴 NO SESSION / EMAIL");
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const email = session.user.email;
    console.log("🟢 USER EMAIL:", email);

    const user = await User.findOne({ email });
    console.log("🟢 USER FOUND:", user?.email, "CREDITS:", user?.credits);

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (user.credits <= 0) {
      console.log("🔴 NO CREDITS");
      return NextResponse.json(
        { error: "No credits left" },
        { status: 402 }
      );
    }

    const body = await req.json();
    console.log("🟢 BODY:", body);

    if (!body.text) {
      return NextResponse.json(
        { error: "Input required" },
        { status: 400 }
      );
    }

    // 🔻 DEDUCT CREDIT
    user.credits = user.credits - 1;
    await user.save();
    console.log("🟢 CREDIT DEDUCTED, REMAINING:", user.credits);

    // 🧠 TRUST SCORE LOGIC
    const trustScore = Math.floor(Math.random() * 40) + 60;
    const risk =
      trustScore > 80
        ? "Low Risk"
        : trustScore > 50
        ? "Medium Risk"
        : "High Risk";

    const response = {
      trustScore,
      risk,
      confidence: "78%",
      remainingCredits: user.credits,
    };

    console.log("🟢 RETURNING RESULT:", response);

    return NextResponse.json(response);
  } catch (error) {
    console.error("❌ TRUST SCORE ERROR:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
