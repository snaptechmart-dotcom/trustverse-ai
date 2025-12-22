import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Complaint from "@/models/Complaint";

export async function GET() {
  try {
    await connectDB();

    await Complaint.create({
      profileUsername: "test_user_123",
      reason: "Fake service / scam test complaint",
      status: "pending",
    });

    return NextResponse.json({
      success: true,
      message: "Test complaint created successfully",
    });
  } catch (error) {
    console.error("Create test complaint error:", error);
    return NextResponse.json(
      { error: "Failed to create test complaint" },
      { status: 500 }
    );
  }
}
