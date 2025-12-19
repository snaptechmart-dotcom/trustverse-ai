import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";

import Complaint from "@/models/Complaint";
import TrustProfile from "@/models/TrustProfile";
import User from "@/models/User";
import History from "@/models/History";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // 🔐 Admin auth check
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { complaintId } = await req.json();

    if (!complaintId) {
      return NextResponse.json(
        { error: "Complaint ID required" },
        { status: 400 }
      );
    }

    await connectDB();

    // 🔍 Find complaint
    const complaint = await Complaint.findById(complaintId);

    if (!complaint) {
      return NextResponse.json(
        { error: "Complaint not found" },
        { status: 404 }
      );
    }

    if (complaint.status === "resolved") {
      return NextResponse.json(
        { error: "Complaint already resolved" },
        { status: 400 }
      );
    }

    // 🔍 Find trust profile
    const profile = await TrustProfile.findOne({
      username: complaint.profileUsername,
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    // 🔍 Find profile owner (user)
    const user = await User.findById(profile.userId);

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // ❌ Deduct credits
    const CREDIT_PENALTY = 10;
    user.credits = Math.max(0, user.credits - CREDIT_PENALTY);
    await user.save();

    // 🧾 Update complaint
    complaint.status = "resolved";
    await complaint.save();

    // 🕒 STEP 6.4 — AUTO INSERT HISTORY (CRITICAL)
    await History.create({
      userId: user._id,
      action: "Complaint Resolved",
      impact: -CREDIT_PENALTY,
      reason: "Complaint verified and resolved by admin",
    });

    return NextResponse.json({
      success: true,
      message: "Complaint resolved successfully",
    });
  } catch (error: any) {
    console.error("RESOLVE COMPLAINT ERROR:", error);

    return NextResponse.json(
      {
        error: error.message || "Failed to resolve complaint",
      },
      { status: 500 }
    );
  }
}
