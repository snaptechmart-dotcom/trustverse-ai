import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function GET() {
  try {
    // 1️⃣ DB
    await dbConnect();

    // 2️⃣ SESSION
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({
        plan: "FREE",
        credits: 0,
      });
    }

    // 3️⃣ USER (🔥 MISSING PART IN YOUR CODE)
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({
        plan: "FREE",
        credits: 0,
      });
    }

    // 🔥 PRO = SINGLE SOURCE OF TRUTH
    if (user.plan === "PRO") {
      return NextResponse.json({
        plan: "PRO",
        credits: "unlimited",
      });
    }

    // FREE USER
    return NextResponse.json({
      plan: "FREE",
      credits: user.credits ?? 0,
    });

  } catch (error) {
    console.error("CREDITS API ERROR 👉", error);
    return NextResponse.json({
      plan: "FREE",
      credits: 0,
    });
  }
}
