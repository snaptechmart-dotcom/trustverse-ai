import { NextResponse } from "next/server";
import connectDB from "@/lib/db";

import Complaint from "@/models/Complaint";
import TrustProfile from "@/models/TrustProfile";
import History from "@/models/History";

export async function POST(req: Request) {
  try {
    console.log("REPORT API HIT");

    const body = await req.json();
    const { username, reason, reportedBy } = body;

    console.log("REPORT BODY:", body);

    if (!username || !reason) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectDB();

    // 🔍 Check profile exists
    const profile = await TrustProfile.findOne({ username });

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    // 🧾 Save complaint
    const complaint = await Complaint.create({
      profileUsername: username,
      reportedBy: reportedBy || "anonymous",
      reason,
      status: "pending",
    });

    console.log("COMPLAINT SAVED:", complaint._id);

    // 🕒 SAVE HISTORY ENTRY (THIS WAS MISSING / BROKEN)
    const history = await History.create({
      profileUsername: username,
      action: "profile_reported",
      impact: -10,
      reason,
    });

    console.log("HISTORY SAVED:", history._id);

    return NextResponse.json({
      success: true,
      message: "Complaint submitted successfully",
    });
  } catch (error: any) {
    console.error("REPORT PROFILE ERROR FULL:", error);

    return NextResponse.json(
      {
        error: error.message || "Failed to submit complaint",
      },
      { status: 500 }
    );
  }
}
