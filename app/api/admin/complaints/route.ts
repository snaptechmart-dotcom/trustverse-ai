import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Complaint from "@/models/Complaint";

export async function GET() {
  try {
    await dbConnect();

    const complaints = await Complaint.find()
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ complaints });
  } catch (error) {
    console.error("Admin complaints fetch error:", error);
    return NextResponse.json(
      { complaints: [] },
      { status: 500 }
    );
  }
}
