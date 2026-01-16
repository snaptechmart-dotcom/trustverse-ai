import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

import dbConnect from "@/lib/dbConnect";
import ScamReport from "@/models/ScamReport";
import User from "@/models/User";
import ProfileHistory from "@/models/ProfileHistory";

export async function POST(req: Request) {
  try {
    console.log("🔥 RESOLVE API HIT");

    await dbConnect();

    // 1️⃣ Session check
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      console.log("❌ NO SESSION EMAIL");
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log("✅ SESSION EMAIL:", session.user.email);

    // 2️⃣ Admin role check
    const admin = await User.findOne({
      email: session.user.email,
      role: "admin",
    });

    if (!admin) {
      console.log("❌ NOT ADMIN");
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    console.log("✅ ADMIN VERIFIED");

    // 3️⃣ Input
    const body = await req.json();
    const { reportId } = body;

    console.log("📦 REQUEST BODY:", body);

    if (!reportId) {
      console.log("❌ REPORT ID MISSING");
      return NextResponse.json(
        { error: "Report ID required" },
        { status: 400 }
      );
    }

    // 4️⃣ Fetch report
    const report = await ScamReport.findById(reportId);
    if (!report) {
      console.log("❌ REPORT NOT FOUND:", reportId);
      return NextResponse.json(
        { error: "Report not found" },
        { status: 404 }
      );
    }

    console.log("📄 REPORT FOUND:", {
      email: report.reportedEmail,
      risk: report.riskLevel,
      resolved: report.resolved,
    });

    if (report.resolved) {
      console.log("⚠️ REPORT ALREADY RESOLVED");
      return NextResponse.json({ success: true });
    }

    // 5️⃣ Trust score impact
    let impact = -10;
    if (report.riskLevel === "Medium Risk") impact = -20;
    if (report.riskLevel === "High Risk") impact = -30;

    console.log("📉 IMPACT CALCULATED:", impact);

    // 6️⃣ Resolve report
    report.resolved = true;
    report.resolvedAt = new Date();
    await report.save();

    console.log("✅ REPORT MARKED RESOLVED");

    // 7️⃣ Update user trust score
    await User.findOneAndUpdate(
      { email: report.reportedEmail },
      { $inc: { trustScore: impact } }
    );

    console.log("✅ USER TRUST SCORE UPDATED");

    // 8️⃣ CREATE HISTORY ENTRY (🔥 KEY STEP)
    console.log("🔥 CREATING HISTORY ENTRY");

    const historyDoc = await ProfileHistory.create({
      userEmail: report.reportedEmail,
      action: "Scam Report Resolved",
      impact,
      reason: report.reason || "Scam detected by AI analysis",
    });

    console.log("🔥 HISTORY SAVED:", historyDoc._id);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("❌ RESOLVE REPORT ERROR:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
