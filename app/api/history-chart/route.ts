import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import History from "@/models/History";

export async function GET() {
  try {
    await dbConnect();

    const history = await History.find()
      .sort({ date: -1 })
      .limit(20);

    return NextResponse.json({ history });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch history" },
      { status: 500 }
    );
  }
}
