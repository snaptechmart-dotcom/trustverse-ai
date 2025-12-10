import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { phone } = await req.json();

    const exists = await User.findOne({ phone });

    return NextResponse.json({ exists: !!exists });
  } catch (error) {
    console.error("Phone Check Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
