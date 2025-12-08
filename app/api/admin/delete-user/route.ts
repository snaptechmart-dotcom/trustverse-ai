import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import User from "@/app/models/User";
import { History } from "@/app/models/History"; // ✔ FIXED IMPORT

export async function POST(req: Request) {
  try {
    await connectDB();

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { success: false, message: "User ID missing" },
        { status: 400 }
      );
    }

    // Delete user
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Also delete all history of this user
    await History.deleteMany({ userId: id });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE USER ERROR:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
