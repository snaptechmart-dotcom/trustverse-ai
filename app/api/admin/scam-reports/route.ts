import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

import dbConnect from "@/lib/dbConnect";
import ScamReport from "@/models/ScamReport";
import User from "@/models/User";

export async function GET(req: Request) {
  try {
    await dbConnect();

    // 1️⃣ Auth check
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json([]);
    }

    // 2️⃣ Admin check
    const adminUser = await User.findOne({
      email: session.user.email,
      role: "admin",
    });

    if (!adminUser) {
      return NextResponse.json([]);
    }

    // 3️⃣ Read query params
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const risk = searchParams.get("risk");
    const status = searchParams.get("status");

    // 4️⃣ Build MongoDB query
    const query: any = {};

    // 🔍 Search (email OR reason)
    if (search) {
      query.$or = [
        { reportedEmail: { $regex: search, $options: "i" } },
        { reason: { $regex: search, $options: "i" } },
      ];
    }

    // 🎛️ Risk filter
    if (risk && risk !== "All") {
      query.riskLevel = risk;
    }

    // 🎛️ Status filter
    if (status === "Pending") {
      query.resolved = false;
    }
    if (status === "Resolved") {
      query.resolved = true;
    }

    // 5️⃣ Fetch filtered reports
    const reports = await ScamReport.find(query)
      .sort({ createdAt: -1 });

    // ✅ Always return array
    return NextResponse.json(reports);

  } catch (error) {
    console.error("ADMIN SCAM REPORTS ERROR:", error);
    return NextResponse.json([]);
  }
}
