import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import TrustScore from "@/models/TrustScore";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await context.params;

    await connectDB();

    const trust = await TrustScore.findOne({
      profileUsername: username,
    });

    if (!trust) {
      return NextResponse.json(
        { error: "Trust score not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      score: trust.score,
      reason: trust.lastUpdatedReason || null,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
