import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/app/lib/dbConnect";
import User from "@/app/models/User";



export async function GET(req: Request) {
  try {
    await dbConnect();

    // 1️⃣ Get token from cookies
    const cookieHeader = req.headers.get("cookie");
    if (!cookieHeader) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const token = cookieHeader
      .split("; ")
      .find((c) => c.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // 2️⃣ Verify JWT
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = decoded.userId;

    // 3️⃣ Find user in DB
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 4️⃣ Build response data
    const response = {
      plan: user.plan || "free",
      validTill: user.planValidTill || null,
      features: {
        trustChecks:
          user.plan === "free"
            ? 1
            : user.plan === "essential"
            ? 10
            : user.plan === "pro"
            ? "unlimited"
            : user.plan === "enterprise"
            ? "unlimited"
            : user.plan === "prelaunch"
            ? "unlimited"
            : 0,

        reports:
          user.plan === "free"
            ? 0
            : user.plan === "essential"
            ? 5
            : user.plan === "pro"
            ? "unlimited"
            : user.plan === "enterprise"
            ? "unlimited"
            : user.plan === "prelaunch"
            ? 10
            : 0,
      },

      usage: {
        trustChecksUsed: user.trustChecksUsed || 0,
        reportsUsed: user.reportsUsed || 0,
      },
    };

    return NextResponse.json(response);
  } catch (err) {
    console.error("PLAN API ERROR:", err);
    return NextResponse.json(
      { error: "Server error", details: String(err) },
      { status: 500 }
    );
  }
}
