import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import User from "@/app/models/User";
import { History } from "@/models/History";


export async function POST(req: Request) {
  try {
    await connectDB();

    const { userId, info, score, analysis } = await req.json();

    if (!userId || !info || score === undefined) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    const history = await History.create({
      userId,
      info,
      score,
      analysis,
    });

    return NextResponse.json({ success: true, history });
  } catch (error) {
    console.error("REPORT API ERROR:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
