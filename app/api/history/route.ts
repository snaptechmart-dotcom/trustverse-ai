import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import dbConnect from "@/lib/dbConnect";
import History from "@/models/History";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ history: [] }, { status: 401 });
    }

    await dbConnect();

    const history = await History.find({})
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return NextResponse.json({ history });
  } catch (err) {
    console.error("HISTORY FETCH ERROR:", err);
    return NextResponse.json({ history: [] }, { status: 500 });
  }
}
