import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import Complaint from "@/models/Complaint";

export async function GET() {
  const session = await getServerSession(authOptions);

  // 🔍 DEBUG (optional)
  console.log("ADMIN SESSION:", session);

  if (!session || !session.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  const complaints = await Complaint.find().sort({ createdAt: -1 });

  return NextResponse.json(complaints);
}
