import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    // ✅ Proper request context
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

    // 🔻 Deduct credit
    user.credits -= 1;
    await user.save();

    // ✅ Minimal working response
    return NextResponse.json({
      trustScore: 74,
      risk: "Medium Risk",
      confidence: "79%",
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
