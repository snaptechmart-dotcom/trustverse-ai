import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await dbConnect();

    // 🔐 Logged-in user session
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 🧠 Read amount from request (default = 1)
    let amount = 1;
    try {
      const body = await req.json();
      if (body?.amount && Number(body.amount) > 0) {
        amount = Number(body.amount);
      }
    } catch {
      // no body → default 1 credit
    }

    // ✅ Find correct logged-in user
    const user = await User.findOne({
      email: session.user.email,
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    /* =====================================
       🟢 UNLIMITED PLANS (NO CREDIT DEDUCT)
       pro / enterprise users
    ===================================== */
    if (user.plan === "pro" || user.plan === "enterprise") {
      return NextResponse.json({
        success: true,
        credits: user.credits, // unchanged
        unlimited: true,
      });
    }

    /* =====================================
       🔴 LIMITED PLANS (free / essential)
    ===================================== */

    // 🚫 Not enough credits
    if (user.credits < amount) {
      return NextResponse.json(
        { error: "Not enough credits" },
        { status: 403 }
      );
    }

    // ➖ Deduct credits safely
    user.credits -= amount;
    await user.save();

    return NextResponse.json({
      success: true,
      credits: user.credits,
      unlimited: false,
    });
  } catch (error) {
    console.error("USE CREDIT ERROR:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
