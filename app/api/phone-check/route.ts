import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import History from "@/models/History";

export async function POST(req: Request) {
  try {
    // 🔐 Auth
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { phone } = await req.json();
    if (!phone) {
      return NextResponse.json({ error: "Phone required" }, { status: 400 });
    }

    // 💳 Credits (FREE only)
    if (user.plan !== "PRO") {
      if (user.credits <= 0) {
        return NextResponse.json({ error: "NO_CREDITS" }, { status: 402 });
      }
      user.credits -= 1;
      await user.save();
    }

    // 🧠 Dummy verification (API later)
    const result = {
      status: "Verified",
      risk: "Low",
      country: "IN",
      carrier: "Unknown",
    };

    // 📝 History
    await History.create({
      userId: user._id,
      tool: "PHONE_CHECK",
      prompt: phone,
      response: JSON.stringify(result),
    });

    return NextResponse.json({
      ...result,
      remainingCredits:
        user.plan === "PRO" ? "unlimited" : user.credits,
    });
  } catch (err) {
    console.error("Phone Check Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
