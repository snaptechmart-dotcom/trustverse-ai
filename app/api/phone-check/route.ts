import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";

import User from "@/models/User";
import ToolHistory from "@/models/ToolHistory";
import PhoneHistory from "@/models/PhoneHistory";

export async function POST(req: Request) {
  try {
    // 1️⃣ DB
    await dbConnect();

    // 2️⃣ SESSION
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 3️⃣ INPUT
    const { phone } = await req.json();
    if (!phone) {
      return NextResponse.json(
        { error: "Phone number required" },
        { status: 400 }
      );
    }

    // 4️⃣ USER
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // 5️⃣ CREDIT
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

    // 6️⃣ DEMO AI RESULT
    const risks = ["Low Risk", "Medium Risk", "High Risk"] as const;
    const risk = risks[Math.floor(Math.random() * risks.length)];

    // 7️⃣ TOOL HISTORY
    await ToolHistory.create({
      userId: user._id,
      tool: "phone-checker",
      input: { phone },
      result: {
        risk,
        remainingCredits:
          user.plan === "PRO" ? "unlimited" : remainingCredits,
      },
    });

    // 🔥 8️⃣ PHONE HISTORY (DASHBOARD COUNT)
    await PhoneHistory.create({
      userId: user._id,
      phone,
      riskLevel: risk,
    });

    // 9️⃣ RESPONSE
    return NextResponse.json({
      status: "Checked",
      risk,
      remainingCredits:
        user.plan === "PRO" ? "unlimited" : remainingCredits,
    });

  } catch (err) {
    console.error("PHONE CHECK ERROR:", err);
    return NextResponse.json(
      { error: "Service temporarily unavailable" },
      { status: 500 }
    );
  }
}
