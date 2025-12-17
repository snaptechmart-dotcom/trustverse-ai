import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Complaint from "@/models/Complaint";

export async function PATCH(req: Request) {
  try {
    await connectDB();
    const { id, status } = await req.json();

    await Complaint.findByIdAndUpdate(id, { status });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("UPDATE COMPLAINT ERROR:", error);
    return NextResponse.json(
      { error: "Failed to update complaint" },
      { status: 500 }
    );
  }
}
