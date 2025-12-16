import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();

    const users = await User.find({})
      .select("_id name email createdAt")
      .sort({ createdAt: -1 });

    return NextResponse.json(users);
  } catch (error) {
    console.error("ADMIN USERS ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
