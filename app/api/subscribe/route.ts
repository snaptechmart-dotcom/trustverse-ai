import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { email } = await req.json();

    const exists = await User.findOne({ email });
    if (exists) {
      return NextResponse.json({ message: "Already subscribed" });
    }

    await User.create({ email });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Subscribe Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
