import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import TrustProfile from "@/models/TrustProfile";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

/**
 * Admin endpoint
 * - Verify / unverify profile
 * - Set adminScore (0–30)
 * NOTE: Real admin role check later add hoga
 */
export async function POST(req: Request) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    // 🔐 Temporary protection (logged-in only)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { username, verified, adminScore } = await req.json();

    if (!username) {
      return NextResponse.json(
        { error: "Username required" },
        { status: 400 }
      );
    }

    const profile = await TrustProfile.findOne({ username });

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    // 🔹 Update verification
    if (typeof verified === "boolean") {
      profile.verified = verified;
    }

    // 🔹 Update admin score (0–30)
    if (typeof adminScore === "number") {
      profile.adminScore = Math.min(
        Math.max(adminScore, 0),
        30
      );
    }

    // 🔹 Recalculate final trust score
    const completeness = Math.min(profile.trustScore, 40);
    const finalScore =
      completeness +
      (profile.verified ? 30 : 0) +
      (profile.adminScore || 0);

    profile.trustScore = Math.min(finalScore, 100);

    await profile.save();

    return NextResponse.json(profile);
  } catch (error) {
    console.error("ADMIN TRUST ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
export async function GET() {
  return new Response(
    "Admin Trust API working. Use POST method.",
    { status: 200 }
  );
}
