import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Complaint from "@/models/Complaint";

export async function GET() {
  try {
    await connectDB();

    const complaints = await Complaint.find({})
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(complaints, { status: 200 });
  } catch (error) {
    console.error("ADMIN COMPLAINTS API ERROR:", error);
    return NextResponse.json(
      { error: "Failed to load complaints" },
      { status: 500 }
    );
  }
}
