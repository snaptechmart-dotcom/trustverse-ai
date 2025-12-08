import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import { History } from "@/app/models/History";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { id } = await req.json();

    // ⭐ FIX: No more type error
    const deleted = await History.deleteOne({ _id: id });

    if (!deleted || deleted.deletedCount === 0) {
      return NextResponse.json({ success: false, message: "Not found" });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE HISTORY ERROR:", err);
    return NextResponse.json({ success: false });
  }
}
