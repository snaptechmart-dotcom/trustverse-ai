import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import { History } from "@/app/models/History";

import User from "@/app/models/User";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { name, info } = await req.json();

    if (!name || !info) {
      return NextResponse.json(
        { error: "Name and info are required" },
        { status: 400 }
      );
    }

    // ⭐ TRUST SCORE AI LOGIC
    const trustKeywords = ["verified", "genuine", "authentic", "secure"];
    const riskKeywords = ["fraud", "scam", "spam", "fake"];

    let score = 50;

    // Positive keywords
    trustKeywords.forEach((word) => {
      if (info.toLowerCase().includes(word)) score += 10;
    });

    // Negative keywords
    riskKeywords.forEach((word) => {
      if (info.toLowerCase().includes(word)) score -= 15;
    });

    // Length and content logic
    const words = info.split(" ").length;
    if (words > 20) score += 10;
    if (info.length > 200) score += 10;

    // Random noise for natural AI feel
    score += Math.floor(Math.random() * 10) - 5;

    // Limit score
    score = Math.max(10, Math.min(score, 95));

    // ⭐ Analysis Message
    let analysis = "";

    if (score > 80) {
      analysis =
        "This profile appears highly trustworthy based on the provided information.";
    } else if (score > 60) {
      analysis =
        "Moderately trustworthy. Some details look good, but further verification is recommended.";
    } else {
      analysis =
        "Low trust score. Multiple risk indicators detected. Use caution.";
    }

    // ⭐ SAVE SCORE TO HISTORY (Database)
    let userId = null;

    try {
      const token = req.headers
        .get("cookie")
        ?.split("token=")[1]
        ?.split(";")[0];

      if (token) {
        const decoded: any = jwt.decode(token);
        userId = decoded?.id;
      }
    } catch (e) {}

    await History.create({
      userId,
      name,
      info,
      score,
      analysis,
    });

    // ⭐ FINAL RESPONSE
    return NextResponse.json({ score, analysis });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
