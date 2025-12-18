import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function POST() {
  try {
    await dbConnect();

    // TEMP: demo user
    const user = await User.findOne();

    if (!user || user.credits <= 0) {
      return NextResponse.json(
        { error: "No credits left" },
        { status: 403 }
      );
    }

    user.credits -= 1;
    await user.save();

    return NextResponse.json({ credits: user.credits });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to deduct credit" },
      { status: 500 }
    );
  }
}
