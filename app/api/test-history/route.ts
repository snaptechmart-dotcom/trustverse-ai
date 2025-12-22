import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import ProfileHistory from "@/models/ProfileHistory";

export async function GET() {
  try {
    await dbConnect();

    await ProfileHistory.create({
      profileUsername: "test",
      action: "Profile Viewed",
      impact: -1,
      reason: "Test history entry",
    });

    return NextResponse.json({
      success: true,
      message: "Test history inserted",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}
