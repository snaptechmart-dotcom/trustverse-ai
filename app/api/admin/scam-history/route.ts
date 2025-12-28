import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import ProfileHistory from "@/models/ProfileHistory";
import User from "@/models/User";

export async function GET(req: Request) {
  try {
    await dbConnect();

    // 1️⃣ Session check
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json([]);
    }

    // 2️⃣ Admin role check
    const adminUser = await User.findOne({
      email: session.user.email,
      role: "admin",
    });

    if (!adminUser) {
      return NextResponse.json([]);
    }

    // 3️⃣ Read query params
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const impact = searchParams.get("impact");

    // 4️⃣ Build MongoDB query
    const query: any = {
      action: "Scam Report Resolved",
    };

    // 🔍 Search (email OR reason)
    if (search) {
      query.$or = [
        { userEmail: { $regex: search, $options: "i" } },
        { reason: { $regex: search, $options: "i" } },
      ];
    }

    // 🎛️ Impact filter
    if (impact && impact !== "All") {
      query.impact = Number(impact);
    }

    // 5️⃣ Fetch filtered history
    const history = await ProfileHistory.find(query)
      .sort({ createdAt: -1 });

    // ✅ Always return array
    return NextResponse.json(history);

  } catch (error) {
    console.error("SCAM HISTORY ERROR:", error);
    return NextResponse.json([]);
  }
}
