import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Complaint from "@/models/Complaint";
import History from "@/models/History";

export async function POST(req: Request) {
  try {
    const { username, reason, reportedBy } = await req.json();

    if (!username || !reason) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    await connectDB();

    // Save complaint
    await Complaint.create({
      profileUsername: username.toLowerCase(),
      reportedBy: reportedBy || "anonymous",
      reason,
      status: "pending",
    });

    // 🔥 VERY IMPORTANT — SAVE HISTORY
    await History.create({
      profileUsername: username.toLowerCase(),
      action: "Profile Reported",
      impact: -10,
      reason,
    });

    return NextResponse.json({
      success: true,
      message: "Complaint & history saved",
    });
  } catch (error) {
    console.error("REPORT API ERROR:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
