import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";

import ScamReport from "@/models/ScamReport";
import TrustScoreHistory from "@/models/TrustScoreHistory";
import PhoneHistory from "@/models/PhoneHistory";

export async function GET() {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // 🔢 COUNTS
    const totalReports = await ScamReport.countDocuments({
      reportedBy: session.user.email,
    });

    const trustChecks = await TrustScoreHistory.countDocuments({
      userId,
    });

    const phoneChecks = await PhoneHistory.countDocuments({
      userId,
    });

    return NextResponse.json({
      totalReports,
      trustChecks,
      phoneChecks,
    });
  } catch (err) {
    console.error("DASHBOARD STATS ERROR:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
