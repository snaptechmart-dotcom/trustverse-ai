import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import ToolHistory from "@/models/ToolHistory";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    // 1️⃣ DB CONNECT
    await dbConnect();

    // 2️⃣ AUTH CHECK
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 3️⃣ INPUT
    const { platform, username } = await req.json();

    if (!platform || !username) {
      return NextResponse.json(
        { error: "Platform and Username required" },
        { status: 400 }
      );
    }

    // 4️⃣ USER FETCH
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // 5️⃣ CREDIT LOGIC
    let remainingCredits = user.credits;

    if (user.plan === "FREE") {
      if (remainingCredits <= 0) {
        return NextResponse.json(
          { error: "No credits left" },
          { status: 402 }
        );
      }

      remainingCredits -= 1;
      user.credits = remainingCredits;
      await user.save();
    }

    // 6️⃣ DEMO SOCIAL ANALYSIS
    const analysis = {
      platform,
      username,
      profileExists: Math.random() > 0.3,
      followers: Math.floor(Math.random() * 5000),
      riskLevel: ["Low Risk", "Medium Risk", "High Risk"][
        Math.floor(Math.random() * 3)
      ],
      activityScore: Math.floor(Math.random() * 100),
    };

    // 🧾 7️⃣ SAVE HISTORY (NEW SYSTEM)
    await ToolHistory.create({
      userId: user._id,
      tool: "social-analyzer",
      input: {
        platform,
        username,
      },
      result: {
        analysis,
        remainingCredits:
          user.plan === "PRO" ? "unlimited" : remainingCredits,
      },
    });

    // 8️⃣ RESPONSE
    return NextResponse.json({
      success: true,
      analysis,
      remainingCredits:
        user.plan === "PRO" ? "unlimited" : remainingCredits,
    });

  } catch (error) {
    console.error("SOCIAL ANALYZER ERROR:", error);
    return NextResponse.json(
      { error: "Service temporarily unavailable" },
      { status: 500 }
    );
  }
}
