import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";

import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { phone } = await req.json();

    if (!phone) {
      return NextResponse.json({ error: "Phone required" }, { status: 400 });
    }

    const exists = await User.findOne({ phone });

    // Fake Phone Analysis Logic
    const phoneInfo = {
      phone,
      exists: !!exists,
      risk: exists ? "Low" : "Medium",
      spamScore: Math.floor(Math.random() * 100),
      lastSeen: exists ? "Recently active" : "No record found",
    };

    return NextResponse.json({ success: true, data: phoneInfo });
  } catch (error) {
    console.error("Phone Check Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
