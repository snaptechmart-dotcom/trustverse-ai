import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { recalculateTrustScore } from "@/lib/trustScoreEngine";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId" },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // ✅ NOW user IS DEFINED
    user.verifiedPhone = true;
    await user.save();

    await recalculateTrustScore(
      user._id.toString(),
      "PHONE_VERIFIED"
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Verify phone error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
