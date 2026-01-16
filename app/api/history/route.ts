import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";


import dbConnect from "@/lib/dbConnect";
import History from "@/models/History";
import mongoose from "mongoose";

export async function GET(req: Request) {
  try {
    /* =========================
       AUTH CHECK
    ========================= */
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    /* =========================
       DB CONNECT
    ========================= */
    await dbConnect();

    /* =========================
       PAGINATION (OPTIONAL)
    ========================= */
    const { searchParams } = new URL(req.url);
    const limit = Number(searchParams.get("limit")) || 50;
    const skip = Number(searchParams.get("skip")) || 0;

    /* =========================
       🔥 FETCH USER HISTORY (FINAL FIX)
    ========================= */
    const userObjectId = new mongoose.Types.ObjectId(
      session.user.id
    );

    const history = await History.find({
      userId: userObjectId,
    })
      .sort({ createdAt: -1 }) // latest first
      .skip(skip)
      .limit(limit)
      .lean();

    /* =========================
       RESPONSE
    ========================= */
    return NextResponse.json({
      success: true,
      history,
    });
  } catch (error) {
    console.error("HISTORY LIST ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch history" },
      { status: 500 }
    );
  }
}
