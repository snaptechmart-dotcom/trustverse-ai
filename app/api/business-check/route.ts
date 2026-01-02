import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";

import User from "@/models/User";
import { saveActivity } from "@/lib/saveActivity";

export async function POST(req: Request) {
  console.log("🚀 BUSINESS CHECK API HIT");

  try {
    // 1️⃣ DB CONNECT
    await dbConnect();
    console.log("✅ DB CONNECTED");

    // 2️⃣ AUTH
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      console.log("❌ UNAUTHORIZED");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 3️⃣ INPUT
    const body = await req.json();
    const businessName =
      body.businessName || body.name || body.business || "";
    const domain =
      body.domain || body.website || body.domainName || "";

    console.log("📥 INPUT:", { businessName, domain });

    if (!businessName || !domain) {
      return NextResponse.json(
        { error: "Business name and domain are required" },
        { status: 400 }
      );
    }

    // 4️⃣ USER FETCH (SAFE WAY)
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      console.log("❌ USER NOT FOUND");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 5️⃣ CREDIT LOGIC
    let remainingCredits = user.credits;

    if (user.plan === "FREE") {
      if (remainingCredits <= 0) {
        return NextResponse.json(
          { error: "No credits left" },
          { status: 402 }
        );
      }

      remainingCredits -= 1;
      user.credits = remainingCredits;
      await user.save();
      console.log("✅ CREDIT DEDUCTED");
    }

    // 6️⃣ ANALYSIS (DEMO)
    const trustScore = 75;
    const riskLevel: "Low Risk" | "Medium Risk" | "High Risk" = "Medium Risk";

    // 🔥 7️⃣ SAVE ACTIVITY HISTORY (UNIFIED – FINAL)
    await saveActivity({
      userEmail: session.user.email,
      tool: "BUSINESS_DOMAIN", // ✅ enum match
      input: `${businessName} | ${domain}`,
      riskLevel,
      trustScore,
      resultSummary: `Business / Domain risk: ${riskLevel}`,
    });

    // 8️⃣ RESPONSE (⚠️ THIS WAS MISSING BEFORE)
    return NextResponse.json({
      status: "Checked",
      businessName,
      domain,
      trustScore,
      riskLevel,
      remainingCredits:
        user.plan === "PRO" ? "unlimited" : remainingCredits,
    });

  } catch (err) {
    console.error("🔥 BUSINESS CHECK ERROR:", err);
    return NextResponse.json(
      { error: "Service temporarily unavailable" },
      { status: 500 }
    );
  }
}
