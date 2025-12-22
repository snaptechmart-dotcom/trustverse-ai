import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import ProfileHistory from "@/models/ProfileHistory";

export async function POST(req: Request) {
  try {
    const { username, reason } = await req.json();
    await dbConnect();

    await ProfileHistory.create({
      username,
      action: "Profile Reported",
      impact: -10,
      reason,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Failed to report profile" },
      { status: 500 }
    );
  }
}
