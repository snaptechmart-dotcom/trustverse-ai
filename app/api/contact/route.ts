import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    // 🔕 TEMPORARY: Email sending disabled
    // Messages will be connected later with Resend

    console.log("Contact message received:", {
      name,
      email,
      message,
    });

    return NextResponse.json({
      success: true,
      note: "Message received (email disabled for now)",
    });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
