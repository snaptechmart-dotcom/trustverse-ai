import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import History from "@/models/History";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { history: [] },
        { status: 200 }
      );
    }

    await dbConnect();

    const history = await History.find({
      userId: session.user.id,
    })
      .sort({ createdAt: -1 })
      .limit(50);

    return NextResponse.json({ history });
  } catch (error) {
    console.error("User history error:", error);

    return NextResponse.json(
      { history: [] },
      { status: 200 }
    );
  }
}
