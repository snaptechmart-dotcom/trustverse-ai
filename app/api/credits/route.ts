import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function GET() {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ credits: null }, { status: 200 });
    }

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ credits: null }, { status: 200 });
    }

    return NextResponse.json({
      credits: user.credits,
      plan: user.plan,
    });
  } catch {
    return NextResponse.json({ credits: null }, { status: 200 });
  }
}
