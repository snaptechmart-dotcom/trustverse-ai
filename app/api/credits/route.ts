import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { authOptions } from "@/lib/auth";

type SafeUser = {
  credits?: number;
  plan?: string;
};

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const user = (await User.findOne({
      email: session.user.email,
    }).lean()) as SafeUser | null;

    if (!user) {
      return NextResponse.json({
        credits: 0,
        plan: "FREE",
      });
    }

    return NextResponse.json({
      credits: user.credits ?? 0,
      plan: user.plan ?? "FREE",
    });
  } catch (error) {
    console.error("Credits API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch credits" },
      { status: 500 }
    );
  }
}
