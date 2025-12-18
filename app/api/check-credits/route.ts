import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function GET() {
  try {
    await dbConnect();

    // TEMP: demo user (later auth se replace hoga)
    const user = await User.findOne();

    if (!user) {
      return NextResponse.json({ credits: 0 });
    }

    return NextResponse.json({ credits: user.credits });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch credits" },
      { status: 500 }
    );
  }
}
