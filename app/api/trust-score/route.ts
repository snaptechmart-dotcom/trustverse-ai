import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import History from "@/models/History";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "Text required" }, { status: 400 });
    }

    const trustScore = Math.min(100, Math.floor(Math.random() * 95) + 5);

    const scoreData = {
      trustScore,
      risk:
        trustScore > 80
          ? "Low"
          : trustScore > 50
          ? "Medium"
          : "High",
      confidence: `${Math.floor(Math.random() * 40) + 60}%`,
    };

    await History.create({
      prompt: text,
      response: JSON.stringify(scoreData),
    });

    return NextResponse.json(scoreData);
  } catch (error) {
    console.error("Trust Score Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
