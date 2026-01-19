import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import ToolHistory from "@/models/ToolHistory";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    await ToolHistory.create({
      userEmail: session.user.email,
      type: body.type,
      input: body.input,
      result: body.result,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("SAVE HISTORY ERROR:", error);
    return NextResponse.json(
      { error: "Failed to save history" },
      { status: 500 }
    );
  }
}
