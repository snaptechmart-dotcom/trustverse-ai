import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import { upgradeUserPlan } from "@/lib/upgradePlan";

export async function POST(req: Request) {
  await dbConnect();
  const session = await getServerSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { plan } = await req.json();

  try {
    const user = await upgradeUserPlan(session.user.id, plan);
    return NextResponse.json({
      success: true,
      message: "Plan upgraded (mock)",
      plan: user.plan,
      credits: user.credits,
      planExpiresAt: user.planExpiresAt,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 400 }
    );
  }
}
