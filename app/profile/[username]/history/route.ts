import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import History from "@/models/History";

export async function GET(req: Request) {
  try {
    await connectDB();

    // 🔥 username URL se manually nikalo
    const url = new URL(req.url);
    const parts = url.pathname.split("/");
    const username = parts[parts.length - 2]; // /profile/:username/history

    if (!username) {
      return NextResponse.json([], { status: 200 });
    }

    const history = await History.find({
      profileUsername: username,
    })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(history);
  } catch (error) {
    console.error("Profile history error:", error);
    return NextResponse.json(
      { error: "Failed to fetch history" },
      { status: 500 }
    );
  }
}
