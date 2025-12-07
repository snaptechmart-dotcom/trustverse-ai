import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/app/lib/dbConnect";
import User from "@/app/models/User";



export async function POST(req: Request) {
  try {
    await dbConnect();

    const body = await req.json();
    const { type } = body; // "trust" or "report"

    // 1️⃣ Read token
    const cookieHeader = req.headers.get("cookie");
    if (!cookieHeader) {
      return NextResponse.json({ error: "No token" }, { status: 401 });
    }

    const token = cookieHeader.split("token=")[1];
    if (!token) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // 2️⃣ Verify JWT
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = decoded.userId;

    // 3️⃣ Get user data
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 4️⃣ PLAN LIMITS
    const PLAN_LIMITS: any = {
      free: { trust: 1, report: 0 },
      prelaunch: { trust: Infinity, report: 10 },
      essential: { trust: 10, report: 5 },
      pro: { trust: Infinity, report: Infinity },
      enterprise: { trust: Infinity, report: Infinity },
    };

    const limit = PLAN_LIMITS[user.plan] || { trust: 0, report: 0 };

    // 5️⃣ Enforce limits
    if (type === "trust") {
      if (user.trustChecksUsed >= limit.trust) {
        return NextResponse.json({ error: "Trust check limit reached" }, { status: 403 });
      }
      user.trustChecksUsed++;
    }

    if (type === "report") {
      if (user.reportsUsed >= limit.report) {
        return NextResponse.json({ error: "Report limit reached" }, { status: 403 });
      }
      user.reportsUsed++;
    }

    // Update database
    await user.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("USAGE API ERROR:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
