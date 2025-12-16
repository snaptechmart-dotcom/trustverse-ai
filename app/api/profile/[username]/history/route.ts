import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import History from "@/models/History";

type Params = {
  params: {
    username: string;
  };
};

export async function GET(_: Request, { params }: Params) {
  try {
    await connectDB(); // 🔴 THIS WAS MISSING IN YOUR FILE

    const history = await History.find({
      profileUsername: params.username.toLowerCase(),
    })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(history);
  } catch (error) {
    console.error("HISTORY FETCH ERROR:", error);
    return NextResponse.json([], { status: 500 });
  }
}
