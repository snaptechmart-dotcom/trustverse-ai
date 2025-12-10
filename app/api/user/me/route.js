import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req) {
  try {
    await connectDB();

    const { userId } = await req.json();

    const user = await User.findOne({ _id: userId });

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Me Route Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
