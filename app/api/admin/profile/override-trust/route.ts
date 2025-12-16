import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import Profile from "@/models/Profile";
import History from "@/models/History";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const { profileId, newScore, note } = await req.json();

  const profile = await Profile.findByIdAndUpdate(
    profileId,
    { trustScore: newScore },
    { new: true }
  );

  await History.create({
    profileId,
    action: "Manual Trust Override",
    impact: 0,
    reason: note || "Admin override",
  });

  return NextResponse.json(profile);
}
