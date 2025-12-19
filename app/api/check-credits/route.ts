import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function GET() {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ credits: 0 });
    }

    let user = await User.findOne({ email: session.user.email });

    // 🔥 AUTO-FIX: new user → give free credits
    if (!user) {
      user = await User.create({
        email: session.user.email,
        credits: 5,
        plan: "free",
        role: "user",
      });
    }

    // 🔥 SAFETY: credits missing
    if (user.credits === undefined || user.credits === null) {
      user.credits = 5;
      await user.save();
    }

    return NextResponse.json({ credits: user.credits });
  } catch (err) {
    console.error("CHECK CREDITS ERROR", err);
    return NextResponse.json({ credits: 0 });
  }
}
