import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Complaint from "@/models/Complaint";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const body = await req.json();
    console.log("📩 Incoming body:", body); // 🔴 VERY IMPORTANT

    const { againstUsername, email, category, description } = body;

    if (!againstUsername || !email || !category || !description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const complaint = await Complaint.create({
      againstUsername,
      email,
      category,
      description,
      status: "pending",
    });

    return NextResponse.json(
      { success: true, complaint },
      { status: 201 }
    );
  } catch (err) {
    console.error("❌ Complaint API error:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
