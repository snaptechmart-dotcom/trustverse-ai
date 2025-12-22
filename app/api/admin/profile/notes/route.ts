import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import Profile from "@/models/Profile";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "admin") {

    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const { profileId, notes } = await req.json();

  await Profile.findByIdAndUpdate(profileId, { adminNotes: notes });

  return NextResponse.json({ success: true });
}
