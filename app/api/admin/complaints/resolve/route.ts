import { NextResponse } from "next/server";
import Complaint from "@/models/Complaint";
import dbConnect from "@/lib/dbConnect";

export async function POST(req: Request) {
  await dbConnect();
  const { complaintId, action } = await req.json();

  const status =
    action === "resolve" ? "resolved" : "rejected";

  await Complaint.findByIdAndUpdate(complaintId, { status });

  return NextResponse.json({ success: true });
}
