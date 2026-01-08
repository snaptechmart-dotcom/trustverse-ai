import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { name, email, phone } = await req.json();

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    await dbConnect();
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    /* -------------------------
       SIMPLE TRUST LOGIC
    -------------------------- */
    let trustScore = 70;
    const signals: string[] = [];

    if (email.includes("@")) {
      trustScore += 5;
      signals.push("Email format looks valid");
    } else {
      trustScore -= 10;
      signals.push("Suspicious email pattern");
    }

    if (phone) {
      trustScore += 5;
      signals.push("Phone number provided");
    } else {
      trustScore -= 5;
      signals.push("Phone number not provided");
    }

    if (name.split(" ").length >= 2) {
      trustScore += 5;
      signals.push("Full name provided");
    } else {
      trustScore -= 5;
      signals.push("Incomplete name");
    }

    trustScore = Math.max(0, Math.min(100, trustScore));

    let riskLevel: "Low Risk" | "Medium Risk" | "High Risk" = "Medium Risk";
    if (trustScore >= 80) riskLevel = "Low Risk";
    else if (trustScore < 50) riskLevel = "High Risk";

    return NextResponse.json({
      trustScore,
      riskLevel,
      summary:
        "Profile analysis completed using basic identity trust signals.",
      signals,
      recommendation:
        riskLevel === "Low Risk"
          ? "Profile appears safe for general interaction."
          : riskLevel === "Medium Risk"
          ? "Proceed with caution and verify details if needed."
          : "Avoid engagement until profile is fully verified.",
    });
  } catch (err) {
    console.error("PROFILE CHECK ERROR:", err);
    return NextResponse.json(
      { error: "Profile analysis failed" },
      { status: 500 }
    );
  }
}
