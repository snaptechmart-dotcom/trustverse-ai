import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import { History } from "@/app/models/History"; // FIXED IMPORT

export async function POST(req: Request) {
  try {
    await connectDB();

    const { id } = await req.json();

    // FIX: Correct TS-callable mongoose method
    const deleted = await History.findByIdAndDelete(id);


    if (!deleted) {
      return NextResponse.json({ success: false, message: "Not found" });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false });
  }
}
