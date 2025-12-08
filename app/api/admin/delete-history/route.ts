import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import History from "@/app/models/History"; // DEFAULT IMPORT (CORRECT)

export async function POST(req: Request) {
  try {
    await connectDB();

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID not provided" },
        { status: 400 }
      );
    }

    // FIX: Always use model function only after ensuring correct export
    const deleted = await History.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "History entry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    console.error("Delete History Error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
