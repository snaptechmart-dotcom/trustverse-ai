import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";

import User from "@/models/User";
import History from "@/models/History";

export async function POST(req: Request) {
  try {
    // 🔐 Auth check
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { toolName, input } = body;

    if (!toolName || !input) {
      return NextResponse.json(
        { error: "Tool name and input required" },
        { status: 400 }
      );
    }

    await connectDB();

    // 🔍 Find user
    const user = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // 💳 Credit check
    const CREDIT_COST = 1;

    if (user.credits < CREDIT_COST) {
      return NextResponse.json(
        { error: "Insufficient credits" },
        { status: 402 }
      );
    }

    // ❌ Deduct credits
    user.credits -= CREDIT_COST;
    await user.save();

    // 🤖 RUN AI TOOL (DEMO RESPONSE)
    // 👉 yahan future me OpenAI / model logic aayega
    const aiResult = `AI result for "${toolName}" with input: ${input}`;

    // 🕒 STEP 6.4 — AUTO INSERT HISTORY
    await History.create({
      userId: user._id,
      action: "AI Tool Used",
      impact: -CREDIT_COST,
      reason: `Used ${toolName}`,
    });

    return NextResponse.json({
      success: true,
      result: aiResult,
      remainingCredits: user.credits,
    });
  } catch (error: any) {
    console.error("RUN AI TOOL ERROR:", error);

    return NextResponse.json(
      {
        error: error.message || "Failed to run AI tool",
      },
      { status: 500 }
    );
  }
}
