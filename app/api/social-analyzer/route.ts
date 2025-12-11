import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import History from "@/models/History";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { platform, username } = await req.json();

    if (!platform || !username) {
      return NextResponse.json(
        { error: "Platform and Username required" },
        { status: 400 }
      );
    }

    // --- Fake Social Analyzer Logic ---
    const analysis = {
      platform,
      username,
      profileExists: Math.random() > 0.3,   // 70% chance exists
      followers: Math.floor(Math.random() * 5000),
      risk: ["Low", "Medium", "High"][Math.floor(Math.random() * 3)],
      activityScore: Math.floor(Math.random() * 100),
    };

    await History.create({
      prompt: `${platform} - ${username}`,
      response: JSON.stringify(analysis),
    });

    return NextResponse.json({ success: true, analysis });
  } catch (error) {
    console.error("Social Analyzer Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
