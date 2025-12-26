import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    trustScore: 70,
    risk: "Low Risk",
    confidence: "90%",
    remainingCredits: 999,
  });
}
