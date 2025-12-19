import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import History from "@/models/History";

export async function GET() {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 🔢 Count stats
  const totalReports = await History.countDocuments();

  const trustChecks = await History.countDocuments({
    type: "Trust Score Analyzer",
  });

  const phoneChecks = await History.countDocuments({
    type: "Phone Number Checker",
  });

  return NextResponse.json({
    totalReports,
    trustChecks,
    phoneChecks,
  });
}
