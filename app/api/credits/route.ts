import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ credits: null }, { status: 401 });
    }

    await dbConnect();

    const user = await User.findOne({ email: session.user.email }).lean();

    if (!user) {
      return NextResponse.json({ credits: null }, { status: 404 });
    }

   return NextResponse.json({
   credits: user.credits, // ALWAYS number
   plan: user.plan,       // plan alag handle hoga
   });

  } catch (err) {
    return NextResponse.json({ credits: null }, { status: 500 });
  }
}
