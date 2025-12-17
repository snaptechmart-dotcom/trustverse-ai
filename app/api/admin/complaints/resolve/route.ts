import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Complaint from "@/models/Complaint";
import History from "@/models/History";
import { requireAdmin } from "@/lib/adminAuth";

export async function POST(req: Request) {
  try {
    // ✅ Admin check
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json(
        { error: "Complaint ID missing" },
        { status: 400 }
      );
    }

    await connectDB();

    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return NextResponse.json(
        { error: "Complaint not found" },
        { status: 404 }
      );
    }

    // ✅ update status
    complaint.status = "resolved";
    await complaint.save();

    // ✅ history log
    await History.create({
      action: "Complaint Resolved",
      adminEmail: admin.email,
      profileUsername: complaint.profileUsername,
      reason: complaint.reason,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Resolve error:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
