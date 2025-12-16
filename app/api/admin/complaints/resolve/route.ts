import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import connectDB from "@/lib/mongodb";
import Complaint from "@/models/Complaint";
import History from "@/models/History";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.email !== process.env.ADMIN_EMAIL) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { complaintId } = await req.json();

    await connectDB();

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

    await History.create({
      action: "Complaint Resolved",
      profileUsername: complaint.profileUsername,
      reason: complaint.reason,
      adminEmail: session.user.email,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Resolve complaint error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
