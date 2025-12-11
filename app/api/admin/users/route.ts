import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();

    const users = await User.find({})
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    return NextResponse.json(users);
  } catch (error) {
    console.error("Users Fetch Error:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
