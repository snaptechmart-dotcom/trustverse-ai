import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import History from "@/models/History";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    await History.create({
      type: body.type,
      input: body.input,
      result: body.result,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save history" },
      { status: 500 }
    );
  }
}
