import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import History from "@/models/History";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const history = await History.find({
    userId: session.user.id,
  })
    .sort({ createdAt: -1 }) // latest first
    .limit(100);

  return NextResponse.json(history);
}
