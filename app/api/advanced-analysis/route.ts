import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";

import History from "@/models/History";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { text } = await req.json();

    // Dummy analysis logic (later upgrade with real AI)
    const analysis = {
      redFlags: text.length > 50 ? "Possible scam indicators found" : "Low risk",
      complexity: text.length,
      probability: Math.min(100, text.length * 1.5),
    };

    await History.create({
      prompt: text,
      response: JSON.stringify(analysis),
    });

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Advanced AI Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
