import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function GET(req: Request) {
  try {
    // 🔐 Security check (Vercel cron only)
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await dbConnect();

    const now = new Date();

    // 🔴 Find expired subscriptions
    const expiredUsers = await User.find({
      subscriptionStatus: "active",
      planExpiresAt: { $lt: now },
    });

    if (expiredUsers.length === 0) {
      return NextResponse.json({ message: "No expired plans" });
    }

    // 🔄 Expire plans
    for (const user of expiredUsers) {
      user.isPro = false;
      user.plan = "FREE";
      user.subscriptionStatus = "expired";
      user.credits = 0;
      user.planExpiresAt = null;
      await user.save();
    }

    return NextResponse.json({
      success: true,
      expiredCount: expiredUsers.length,
    });
  } catch (error) {
    console.error("CRON ERROR:", error);
    return NextResponse.json(
      { error: "Cron failed" },
      { status: 500 }
    );
  }
}
