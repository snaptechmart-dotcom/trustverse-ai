import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";

export async function GET() {
  // 🔐 SESSION (FINAL & CORRECT)
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // ✅ NORMALIZE EMAIL (CRITICAL)
  const email = session.user.email.toLowerCase();

  // 👤 USER FROM DB
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      credits: true,
      plan: true,
    },
  });

  if (!user) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    credits: user.credits ?? 0,
    plan: user.plan ?? "free",
  });
}
