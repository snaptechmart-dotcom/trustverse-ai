import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import ToolHistory from "@/models/ToolHistory";

/**
 * ⏱️ RATE LIMIT
 * Rule: 1 user = max 5 requests per 1 minute
 */
const rateLimitMap = new Map<
  string,
  { count: number; time: number }
>();

export async function POST(req: Request) {
  try {
    // 1️⃣ DB CONNECT
    await dbConnect();

    // 2️⃣ SESSION CHECK
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // 3️⃣ RATE LIMIT CHECK
    const now = Date.now();
    const record = rateLimitMap.get(userId);

    if (!record) {
      rateLimitMap.set(userId, { count: 1, time: now });
    } else if (now - record.time < 60_000) {
      if (record.count >= 5) {
        return NextResponse.json(
          { error: "Too many requests. Please wait 1 minute." },
          { status: 429 }
        );
      }
      record.count += 1;
    } else {
      rateLimitMap.set(userId, { count: 1, time: now });
    }

    // 4️⃣ INPUT VALIDATION
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json(
        { error: "Email required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // 5️⃣ USER FETCH
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // 6️⃣ CREDIT CHECK & DEDUCT
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

    // 7️⃣ DEMO AI EMAIL RISK RESULT
    const risks = ["Low Risk", "Medium Risk", "High Risk"] as const;
    const risk = risks[Math.floor(Math.random() * risks.length)];

    // 🧾 8️⃣ SAVE HISTORY (🔥 MAIN ADDITION 🔥)
    await ToolHistory.create({
      userId: user._id,
      tool: "email-checker",
      input: {
        email,
      },
      result: {
        risk,
        remainingCredits:
          user.plan === "PRO" ? "unlimited" : remainingCredits,
      },
    });

    // 9️⃣ RESPONSE
    return NextResponse.json({
      status: "Checked",
      email,
      risk,
      remainingCredits:
        user.plan === "PRO" ? "unlimited" : remainingCredits,
    });

  } catch (err) {
    console.error("EMAIL CHECK ERROR:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
