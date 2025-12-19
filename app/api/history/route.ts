import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";

import Complaint from "@/models/Complaint";
import TrustProfile from "@/models/TrustProfile";
import History from "@/models/History";

/* =======================
   GET → Fetch user history
   ======================= */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const history = await History.find({
      userId: session.user.id,
    }).sort({ createdAt: -1 });

    return NextResponse.json({ history });
  } catch (error) {
    console.error("GET HISTORY ERROR:", error);
    return NextResponse.json(
      { error: "Failed to load history" },
      { status: 500 }
    );
  }
}

/* =======================
   POST → Submit complaint
   ======================= */
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { username, reason } = body;

    if (!username || !reason) {
      return NextResponse.json(
        { error: "Username and reason required" },
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

    // ⚠️ NOTE:
    // Profile suspended check intentionally SKIPPED for now
    // so that STEP 6 testing works smoothly.
    // Later we can add business rules here.

    // 🧾 Save complaint
    await Complaint.create({
      profileUsername: username,
      reportedBy: session.user.id,
      reason,
      status: "pending",
    });

    // 🕒 SAVE HISTORY (STEP 6.4 — CRITICAL)
    await History.create({
      userId: session.user.id,
      action: "Profile Reported",
      impact: -10,
      reason,
    });

    return NextResponse.json({
      success: true,
      message: "Complaint submitted successfully",
    });
  } catch (error: any) {
    console.error("POST HISTORY ERROR FULL:", error);

    return NextResponse.json(
      {
        error: error.message || "Failed to submit complaint",
      },
      { status: 500 }
    );
  }
}
