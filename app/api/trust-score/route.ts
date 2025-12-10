import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import History from "@/models/History";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { text } = await req.json();

    const trustScore = Math.min(100, text.length * 2); // Example logic

    await History.create({
      prompt: text,
      response: JSON.stringify({ trustScore }),
    });

    return NextResponse.json({ trustScore });
  } catch (error) {
    console.error("Trust Score Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
