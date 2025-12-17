import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Complaint from "@/models/Complaint";

export async function GET() {
  await connectDB();
  const complaints = await Complaint.find().sort({ createdAt: -1 });
  return NextResponse.json(complaints);
}

export async function PATCH(req: Request) {
  try {
    await connectDB();
    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json(
        { error: "Missing id or status" },
        { status: 400 }
      );
    }

    await Complaint.findByIdAndUpdate(id, { status });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PATCH ERROR:", err);
    return NextResponse.json(
      { error: "Update failed" },
      { status: 500 }
    );
  }
}
