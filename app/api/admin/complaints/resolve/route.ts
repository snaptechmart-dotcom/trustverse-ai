import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import dbConnect from "@/lib/db";
import Complaint from "@/models/Complaint";
import History from "@/models/History";

export async function POST(req: Request) {
  try {
    // 🔐 Admin check
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { complaintId } = await req.json();
    if (!complaintId) {
      return NextResponse.json(
        { error: "Complaint ID missing" },
        { status: 400 }
      );
    }

    // 🔄 Update complaint
    const complaint = await Complaint.findByIdAndUpdate(
      complaintId,
      { status: "resolved" },
      { new: true }
    );

    if (!complaint) {
      return NextResponse.json(
        { error: "Complaint not found" },
        { status: 404 }
      );
    }

    // 📝 Save history log
    await History.create({
      action: "Complaint Resolved",
      adminEmail: session.user.email,
      profileUsername: complaint.profileUsername,
      reason: complaint.reason,
    });

    return NextResponse.json({
      success: true,
      message: "Complaint resolved",
    });
  } catch (error) {
    console.error("Resolve complaint error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
