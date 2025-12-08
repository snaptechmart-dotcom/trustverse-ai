// app/api/social-analyzer/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import { History } from "@/app/models/History";

import jwt from "jsonwebtoken";

type Body = {
  platform?: string;
  handle?: string;
};

export async function POST(req: Request) {
  try {
    await connectDB();

    const body: Body = await req.json();
    const platform = (body.platform || "").trim();
    const handle = (body.handle || "").trim();

    if (!platform || !handle) {
      return NextResponse.json(
        { error: "platform and handle are required" },
        { status: 400 }
      );
    }

    // -----------------------
    // 🔎 Heuristics (offline)
    // -----------------------
    const h = handle.toLowerCase();

    // suspicious keywords often in scammy accounts
    const suspiciousWords = ["free", "giveaway", "offers", "earn", "discount", "loan"];
    const officialWords = ["official", "real", "verified", "team", "inc", "co"];

    let suspicionCount = 0;
    let officialCount = 0;

    suspiciousWords.forEach((w) => {
      if (h.includes(w)) suspicionCount += 1;
    });
    officialWords.forEach((w) => {
      if (h.includes(w)) officialCount += 1;
    });

    // pattern checks
    const digitsCount = (h.match(/\d/g) || []).length;
    const underscores = (h.match(/_/g) || []).length;
    const dots = (h.match(/\./g) || []).length;
    const length = h.length;

    // heuristics to estimate follower-quality proxies (offline)
    // longer handles & presence of official words -> better
    let score = 60;
    if (officialCount > 0) score += 10;
    if (suspicionCount > 0) score -= 20 * suspicionCount;
    if (digitsCount > 4) score -= 10;
    if (digitsCount === 0) score += 5;
    if (underscores > 2) score -= 5;
    if (dots > 0) score -= 3;
    if (length >= 10) score += 5;
    if (length < 4) score -= 15;

    // platform-specific small bias (example)
    const p = platform.toLowerCase();
    if (p.includes("linkedin")) score += 8;
    if (p.includes("instagram")) score += 2;
    if (p.includes("twitter") || p.includes("x")) score += 1;

    // random small noise for natural results
    score += Math.floor(Math.random() * 9) - 4;

    // clamp
    score = Math.max(5, Math.min(98, score));

    // scam probability inverse of score
    const scamProbability = Math.max(1, 100 - Math.round(score));

    // Compose analysis text & flags
    const flags: string[] = [];
    if (suspicionCount > 0) flags.push(
      `Found ${suspicionCount} suspicious keyword(s) in handle.`
    );
    if (officialCount > 0) flags.push("Handle contains 'official' markers.");
    if (digitsCount > 4) flags.push("Handle has many digits — often auto accounts.");
    if (length < 4) flags.push("Handle is very short — could be auto/temporary.");
    if (underscores > 2) flags.push("Many underscores — unusual naming patterns.");

    if (flags.length === 0) flags.push("No obvious red flags in handle.");

    const recommendations = [
      "Check the profile picture and recent posts for consistency.",
      "Look for verified badge or contact links on the profile.",
      "Search for the handle on other platforms to cross-verify.",
      "If the handle contains 'giveaway' or 'free', treat with caution.",
    ];

    // rich analysis object
    const analysis = {
      handle,
      platform,
      score: Math.round(score),
      scamProbability,
      flags,
      recommendations,
      generatedAt: new Date().toISOString(),
    };

    // -----------------------
    // 🔒 Attach userId if logged in (optional)
    // -----------------------
    let userId = null;
    try {
      const token = req.headers.get("cookie")?.split("token=")[1]?.split(";")[0];
      if (token) {
        const decoded: any = jwt.decode(token);
        userId = decoded?.id || null;
      }
    } catch (e) {
      // ignore
    }

    // -----------------------
    // 🗄 Save into History collection (so user can view / download)
    // -----------------------
    await History.create({
      userId,
      name: `${platform}:${handle}`, // name to show in history
      info: `Social Analyzer result for ${handle} on ${platform}`,
      score: Math.round(score),
      analysis: JSON.stringify({
        scamProbability,
        flags,
        recommendations,
      }),
    });

    // -----------------------
    // ✅ Return response
    // -----------------------
    return NextResponse.json({ analysis });
  } catch (err) {
    console.error("social-analyzer error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
