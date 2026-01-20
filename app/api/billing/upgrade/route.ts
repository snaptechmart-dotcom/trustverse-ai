import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { upgradeUserPlan } from "@/lib/upgradePlan";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { plan, billing } = await req.json();

  if (!plan || !billing) {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }

  try {
    const result = await upgradeUserPlan(
      session.user.id,
      plan,
      billing
    );

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    console.error("UPGRADE ERROR:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
