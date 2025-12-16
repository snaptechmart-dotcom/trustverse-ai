import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import Profile from "@/models/Profile";
import History from "@/models/History";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { profileId, suspend } = await req.json();

    const profile = await Profile.findOneAndUpdate(
      { _id: profileId },
      { $set: { isSuspended: suspend } },
      { new: true }
    );

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    

    return NextResponse.json(profile);
  } catch (error) {
    console.error("SUSPEND ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
