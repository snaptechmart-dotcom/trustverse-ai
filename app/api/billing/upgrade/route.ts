import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { upgradeUserPlan } from "@/lib/upgradePlan";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { plan, billing } = await req.json();

  if (!plan || !billing) {
    return NextResponse.json(
      { error: "Plan and billing required" },
      { status: 400 }
    );
  }

  try {
    const user = await upgradeUserPlan(
      session.user.id,
      plan,
      billing // ✅ FIX — third argument
    );

    return NextResponse.json({
      success: true,
      message: "Plan upgraded successfully",
      credits: user.credits,
      plan: user.plan,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Upgrade failed" },
      { status: 500 }
    );
  }
}
