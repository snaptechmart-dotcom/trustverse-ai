import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import History from "@/models/History";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; // ✅ IMPORTANT

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  await dbConnect();

  const history = await History.findOne({
    _id: id,
    userId: session.user.id,
  });

  if (!history) {
    return NextResponse.json(
      { success: false, message: "Report not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    id: history._id,
    data: history,
  });
}
