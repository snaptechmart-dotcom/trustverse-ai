import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function POST() {
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

    if (user.credits <= 0) {
      return NextResponse.json(
        { error: "No credits left" },
        { status: 403 }
      );
    }

    // ➖ Deduct 1 credit
    user.credits = user.credits - 1;
    await user.save();

    return NextResponse.json({
      success: true,
      credits: user.credits,
    });
  } catch (error) {
    console.error("USE CREDIT ERROR:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
