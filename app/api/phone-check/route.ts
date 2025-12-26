import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const { phone, userId } = await req.json();

    // 🛑 VALIDATION
    if (!phone || typeof phone !== "string") {
      return NextResponse.json(
        { error: "Invalid phone number" },
        { status: 400 }
      );
    }

    if (!userId || typeof userId !== "string") {
      return NextResponse.json(
        { error: "Invalid user" },
        { status: 401 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // 💳 CREDIT LOGIC (ATOMIC – SAME AS TRUST SCORE)
    let remainingCredits = user.credits;

    if (user.plan === "free") {
      if (remainingCredits <= 0) {
        return NextResponse.json(
          { error: "No credits left" },
          { status: 402 }
        );
      }

      const updatedUser = await User.findOneAndUpdate(
        { _id: userId, credits: { $gt: 0 } },
        { $inc: { credits: -1 } },
        { new: true }
      );

      if (!updatedUser) {
        return NextResponse.json(
          { error: "No credits left" },
          { status: 402 }
        );
      }

      remainingCredits = updatedUser.credits;
    }

    // 📱 PHONE CHECK RESULT (SAFE DEMO)
    const risk =
      phone.endsWith("000") ? "High Risk" : "Low Risk";

    return NextResponse.json({
      status: "Checked",
      risk,
      remainingCredits:
        user.plan === "pro" ? "unlimited" : remainingCredits,
    });
  } catch (error) {
    console.error("PHONE CHECK API ERROR:", error);
    return NextResponse.json(
      { error: "Service temporarily unavailable" },
      { status: 500 }
    );
  }
}
