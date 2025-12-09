import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import History from "@/models/History";


export async function GET() {
  try {
    await connectDB();

    // Fetch all users sorted by latest
    const users = await User.find().sort({ createdAt: -1 });

    return NextResponse.json({ users });
  } catch (error) {
    return NextResponse.json(
      { error: "Server error while loading users" },
      { status: 500 }
    );
  }
}
