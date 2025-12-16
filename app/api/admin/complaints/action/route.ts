import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Complaint from "@/models/Complaint";
import Profile from "@/models/Profile";
import History from "@/models/History";
import { requireAdmin } from "@/lib/adminAuth";

export async function POST(req: Request) {
  await requireAdmin();
  await dbConnect();

  const { complaintId, action, impact } = await req.json();

  const complaint = await Complaint.findById(complaintId);
  if (!complaint) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  complaint.status = action; // resolved / rejected
  await complaint.save();

  // Apply trust score impact
  if (impact !== 0) {
    await Profile.findByIdAndUpdate(
      complaint.reportedProfileId,
      { $inc: { trustScore: impact } }
    );

    await History.create({
      profileId: complaint.reportedProfileId,
      action: "Admin Complaint Action",
      impact,
      reason: `Complaint ${action}`,
    });
  }

  return NextResponse.json({ success: true });
}
