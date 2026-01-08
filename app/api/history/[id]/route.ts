import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import History from "@/models/History";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 🔑 THIS IS THE CRITICAL FIX
    const { id } = await context.params;

    await dbConnect();

    const history = await History.findById(id);

    if (!history) {
      return NextResponse.json(
        { error: "Report not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ history });
  } catch (error) {
    console.error("HISTORY DETAIL ERROR:", error);
    return NextResponse.json(
      { error: "Failed to load report" },
      { status: 500 }
    );
  }
}
