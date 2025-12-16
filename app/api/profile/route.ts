import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import TrustProfile from "@/models/TrustProfile";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

// 🔢 Profile completeness (0–40)
function calculateCompletenessScore(data: any) {
  const fields = [
    data.username,
    data.displayName,
    data.category,
    data.location,
    data.bio,
  ];

  const filled = fields.filter(
    (f) => typeof f === "string" && f.trim().length > 0
  ).length;

  return Math.round((filled / fields.length) * 40);
}

// ⭐ Final Trust Score (0–100)
function calculateFinalTrustScore({
  completeness,
  verified,
  adminScore,
}: {
  completeness: number;
  verified: boolean;
  adminScore: number;
}) {
  const verifiedBonus = verified ? 30 : 0;
  const adminBonus = Math.min(Math.max(adminScore || 0, 0), 30);

  return Math.min(completeness + verifiedBonus + adminBonus, 100);
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    // 🔹 Completeness score
    const completenessScore = calculateCompletenessScore(data);

    // 🔹 Fetch existing profile (to preserve verified/adminScore)
    const existingProfile = await TrustProfile.findOne({
      email: session.user.email,
    });

    const verified = existingProfile?.verified ?? false;
    const adminScore = existingProfile?.adminScore ?? 0;

    // 🔹 Final trust score
    const finalTrustScore = calculateFinalTrustScore({
      completeness: completenessScore,
      verified,
      adminScore,
    });

    // 🔹 Save / update profile
    const profile = await TrustProfile.findOneAndUpdate(
      { email: session.user.email },
      {
        email: session.user.email,
        username: data.username,
        displayName: data.displayName,
        category: data.category,
        location: data.location,
        bio: data.bio,
        trustScore: finalTrustScore,
      },
      { upsert: true, new: true }
    );

    return NextResponse.json(profile);
  } catch (error) {
    console.error("PROFILE SAVE ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
