import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Complaint from "@/models/Complaint";

export async function POST(req: Request) {
  const { username, reason } = await req.json();
  await connectDB();

  await Complaint.create({
    profileUsername: username,
    reason,
    status: "pending",
  });

  return NextResponse.json({ success: true });
}
