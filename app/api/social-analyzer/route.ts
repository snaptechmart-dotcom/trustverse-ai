import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import History from "@/models/History";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { text } = await req.json();

    const result = {
      length: text.length,
      words: text.split(" ").length,
      sentiment: "neutral",
    };

    await History.create({
      prompt: text,
      response: JSON.stringify(result),
    });

    return NextResponse.json({ success: true, analysis: result });
  } catch (error) {
    console.error("Social Analyzer Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
