import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await dbConnect();

    /* =========================
       AUTH
    ========================= */
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    /* =========================
       CREDIT AMOUNT
    ========================= */
    let amount = 1;
    try {
      const body = await req.json();
      if (body?.amount && Number(body.amount) > 0) {
        amount = Number(body.amount);
      }
    } catch {
      // default = 1
    }

    /* =========================
       USER
    ========================= */
    const user = await User.findOne({
      email: session.user.email.toLowerCase(),
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const now = new Date();

    /* =========================
       ⛔ PLAN EXPIRY CHECK (GLOBAL)
    ========================= */
    if (user.planExpiresAt && now > user.planExpiresAt) {
      user.plan = "free";
      user.billing = null;
      user.credits = 0;
      user.planExpiresAt = null;
      await user.save();

      return NextResponse.json(
        { error: "Plan expired. Please upgrade." },
        { status: 403 }
      );
    }

    /* =========================
       🚫 CREDIT CHECK (ALL PLANS)
    ========================= */
    if (user.credits < amount) {
      // auto fallback to FREE
      user.plan = "free";
      user.billing = null;
      user.credits = 0;
      user.planExpiresAt = null;
      await user.save();

      return NextResponse.json(
        { error: "Credits exhausted. Please upgrade." },
        { status: 403 }
      );
    }

    /* =========================
       ➖ DEDUCT CREDIT
    ========================= */
    user.credits -= amount;

    /* =========================
       🧹 AUTO RESET IF 0
    ========================= */
    if (user.credits <= 0) {
      user.plan = "free";
      user.billing = null;
      user.planExpiresAt = null;
      user.credits = 0;
    }

    await user.save();

    return NextResponse.json({
      success: true,
      credits: user.credits,
      plan: user.plan,
    });
  } catch (error) {
    console.error("USE CREDIT ERROR:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
