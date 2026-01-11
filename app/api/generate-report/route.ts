import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Report from "@/models/Report";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const {
      toolType,
      inputValue,
      result,        // full AI result
      trustScore,
      riskLevel,
      verdict,
    } = body;

    if (!toolType || !inputValue) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // ✅ FINAL UNIFIED SAVE (HISTORY SAFE)
    const report = await Report.create({
      reportId: crypto.randomUUID(),

      userId: session.user.id,

      tool: toolType,          // 🔥 unified field
      input: inputValue,       // 🔥 REQUIRED by schema

      summary: {
        trustScore: trustScore ?? null,
        riskLevel: riskLevel ?? "Unknown",
        verdict: verdict ?? "",
      },

      result: result ?? {},    // 🔥 unified field
    });

    return NextResponse.json({
      success: true,
      reportId: report.reportId,
    });
  } catch (err) {
    console.error("GENERATE REPORT ERROR:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
