import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

import dbConnect from "@/lib/dbConnect";
import History from "@/models/History";
import mongoose from "mongoose";

export async function GET(
  req: Request,
  ctx: { params: Promise<{ reportId?: string }> }
) {
  try {
    /* AUTH */
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    /* ✅ NEXT 16 FIX */
    const { reportId } = await ctx.params;

    if (!reportId || !mongoose.Types.ObjectId.isValid(reportId)) {
      return NextResponse.json(
        { error: "Invalid report ID" },
        { status: 400 }
      );
    }

    await dbConnect();

    const report = await History.findOne({
      _id: reportId,
      userId: session.user.id,
    }).lean();

    if (!report) {
      return NextResponse.json(
        { error: "Report not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      report,
    });
  } catch (err) {
    console.error("HISTORY REPORT ERROR:", err);
    return NextResponse.json(
      { error: "Failed to load report" },
      { status: 500 }
    );
  }
}
