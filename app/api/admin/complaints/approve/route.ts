import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Complaint from "@/models/Complaint";
import { recalculateTrustScore } from "@/lib/trustScoreEngine";

export async function POST(req: Request) {
  await dbConnect();
  const { complaintId } = await req.json();

  const complaint = await Complaint.findById(complaintId);
  if (!complaint) {
    return NextResponse.json({ error: "Complaint not found" }, { status: 404 });
  }

  complaint.status = "approved";
  await complaint.save();

  await recalculateTrustScore(
    complaint.reportedUser.toString(),
    "COMPLAINT_APPROVED",
    { severity: complaint.severity }
  );

  return NextResponse.json({ success: true });
}
