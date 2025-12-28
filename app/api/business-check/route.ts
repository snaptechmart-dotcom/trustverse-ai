import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import ToolHistory from "@/models/ToolHistory";

export async function POST(req: Request) {
  console.log("🚀 API HIT");

  try {
    await dbConnect();
    console.log("✅ DB CONNECTED");

    const session = await getServerSession(authOptions);
    console.log("SESSION:", session);

    if (!session?.user?.id) {
      console.log("❌ NO SESSION");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    console.log("BODY:", body);

    const businessName =
      body.businessName || body.name || body.business || "";
    const domain =
      body.domain || body.website || body.domainName || "";

    console.log("PARSED:", { businessName, domain });

    if (!businessName || !domain) {
      console.log("❌ VALIDATION FAIL");
      return NextResponse.json(
        { error: "Business name and domain are required" },
        { status: 400 }
      );
    }

    const user = await User.findById(session.user.id);
    console.log("USER:", user?._id);

    if (!user) {
      console.log("❌ USER NOT FOUND");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let remainingCredits = user.credits;

    if (user.plan === "FREE") {
      if (remainingCredits <= 0) {
        console.log("❌ NO CREDITS");
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

    const trustScore = 75;
    const riskLevel = "Medium Risk";

    console.log("👉 SAVING HISTORY NOW");

    await ToolHistory.create({
      userId: user._id,
      tool: "business-checker",
      input: { businessName, domain },
      result: { trustScore, riskLevel },
    });

    console.log("✅ HISTORY SAVED");

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
    console.error("🔥 ACTUAL ERROR:", err);
    return NextResponse.json(
      { error: "Service temporarily unavailable" },
      { status: 500 }
    );
  }
}
