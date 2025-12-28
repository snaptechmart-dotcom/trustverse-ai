import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import ScamReport from "@/models/ScamReport";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    // 1️⃣ DB CONNECT
    await dbConnect();

    // 2️⃣ AUTH CHECK
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !session.user.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 3️⃣ INPUT
    const { tool, content, riskLevel } = await req.json();

    if (!tool || !content || !riskLevel) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 4️⃣ USER CHECK
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // 5️⃣ SAVE SCAM REPORT (MODEL-COMPATIBLE ✅)
    await ScamReport.create({
      reportedEmail: session.user.email,   // ✅ required
      reportedBy: user.email,              // ✅ required
      reason: content,                     // ✅ required
      impact: riskLevel === "High Risk" ? -30 : -10,
      tool,
      riskLevel,
      resolved: false,
    });

    return NextResponse.json({
      success: true,
      message: "Scam report submitted successfully",
    });

  } catch (error) {
    console.error("REPORT SCAM ERROR:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
