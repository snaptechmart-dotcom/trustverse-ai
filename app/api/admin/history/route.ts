import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import dbConnect from "@/lib/db";
import History from "@/models/History";

export async function GET() {
  try {
    // 🔐 Admin check
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    // 📜 Fetch history (latest first)
    const history = await History.find()
      .sort({ createdAt: -1 })
      .limit(100);

    return NextResponse.json(history);
  } catch (error) {
    console.error("Admin history error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
