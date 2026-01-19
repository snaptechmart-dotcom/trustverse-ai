import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    /* =========================
       AUTH
    ========================= */
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, history: [] },
        { status: 401 }
      );
    }

    /* =========================
       USER ID (MONGO SAFE)
    ========================= */
    const userId = new ObjectId(session.user.id).toString();

    /* =========================
       FETCH HISTORY
    ========================= */
    const history = await prisma.history.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    /* =========================
       UI SAFE TRANSFORM
    ========================= */
    const safeHistory = history.map((h) => ({
      ...h,
      creditsUsed: typeof h.creditsUsed === "number" ? h.creditsUsed : 0,
      summary: h.summary ?? {},
      result: h.result ?? {},
    }));

    /* =========================
       RESPONSE
    ========================= */
    return NextResponse.json({
      success: true,
      history: safeHistory,
    });
  } catch (error) {
    console.error("HISTORY API ERROR:", error);

    return NextResponse.json(
      { success: false, history: [] },
      { status: 500 }
    );
  }
}
