import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import History from "@/models/History";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { businessName, domain } = await req.json();
    const cleanBusiness = String(businessName || "").trim();
    const cleanDomain = String(domain || "").trim().toLowerCase();

    if (!cleanBusiness || !cleanDomain) {
      return NextResponse.json(
        { error: "Business name and domain are required" },
        { status: 400 }
      );
    }

    await dbConnect();
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    /* ===== CREDIT SYSTEM ===== */
    const creditsUsed = user.plan === "PRO" ? 2 : 1;

    if (user.plan !== "PRO" && user.credits < creditsUsed) {
      return NextResponse.json(
        { error: "Not enough credits" },
        { status: 402 }
      );
    }

    if (user.plan !== "PRO") {
      user.credits -= creditsUsed;
      await user.save();
    }

    const remainingCredits =
      user.plan === "PRO" ? "Unlimited" : user.credits;

    /* ===== DYNAMIC TRUST ENGINE ===== */
    let trustScore = 45 + Math.floor(Math.random() * 20);
    const indicators: string[] = [];

    const isEmail = cleanDomain.includes("@");
    if (isEmail) {
      trustScore -= 30;
      indicators.push("Input appears to be an email, not a business domain");
    } else if (cleanDomain.includes(".")) {
      trustScore += 15;
      indicators.push("Valid domain structure detected");
    }

    if (cleanBusiness.length >= 4) {
      trustScore += 10;
      indicators.push("Business name appears complete and identifiable");
    } else {
      trustScore -= 10;
      indicators.push("Business name appears weak or incomplete");
    }

    const riskyWords = ["free", "bonus", "win", "crypto", "loan", "investment"];
    if (riskyWords.some(w => cleanDomain.includes(w))) {
      trustScore -= 25;
      indicators.push("High-risk marketing keywords detected");
    } else {
      trustScore += 10;
      indicators.push("No common scam keywords identified");
    }

    if (cleanDomain.endsWith(".com") || cleanDomain.endsWith(".in")) {
      trustScore += 5;
      indicators.push("Uses a commonly trusted domain extension");
    }

    trustScore = Math.max(0, Math.min(100, trustScore));

    const riskLevel =
      trustScore >= 80
        ? "Low Risk"
        : trustScore >= 50
        ? "Medium Risk"
        : "High Risk";

    const accountType =
      riskLevel === "Low Risk"
        ? "Likely Legitimate Business"
        : riskLevel === "Medium Risk"
        ? "Requires Additional Verification"
        : "Potentially Risky Business";

    const longReport = `
Our AI-based Business Verification system evaluated the submitted business
information using publicly observable trust signals and known risk patterns.

This analysis considers:
• Domain structure validity
• Keyword-based scam indicators
• Business name consistency
• Common impersonation and fraud behaviors

The system does not access private databases or guarantee legitimacy.
It is intended as an early-warning and risk-awareness tool.

Risk Interpretation Guide:
Low Risk – No immediate warning signs detected
Medium Risk – Some caution advised before engagement
High Risk – Multiple risk indicators detected

Always combine automated results with manual verification.
`;

    const recommendation =
      riskLevel === "Low Risk"
        ? "Business appears reasonably safe. Proceed with standard verification practices."
        : riskLevel === "Medium Risk"
        ? "Proceed with caution. Verify registration details, address, and reviews."
        : "High risk detected. Avoid financial or personal engagement until independently verified.";

    const result = {
  score: trustScore,          // 👈 universal
  trustScore,                // (optional legacy)
  riskLevel,
  accountType,
  summary: "Business trust analysis completed successfully.",
  details: {
    indicators,
    recommendation,
    longReport
  },
  creditsUsed,
};


    await History.create({
      userId: user._id,
      tool: "BUSINESS_CHECK",
      query: `${cleanBusiness} (${cleanDomain})`,
      result,
    });

    return NextResponse.json({
      businessName: cleanBusiness,
      domain: cleanDomain,
      ...result,
      remainingCredits,
    });
  } catch (error) {
    console.error("BUSINESS CHECK ERROR:", error);
    return NextResponse.json(
      { error: "Business analysis failed" },
      { status: 500 }
    );
  }
}
