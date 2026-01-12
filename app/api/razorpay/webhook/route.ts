import { NextResponse } from "next/server";

export const runtime = "nodejs"; // VERY IMPORTANT

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();

    console.log("🔥 WEBHOOK HIT");
    console.log("🔥 RAW BODY:", rawBody);
    console.log("🔥 HEADERS:", Object.fromEntries(req.headers.entries()));

    return NextResponse.json(
      { received: true, debug: true },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("❌ WEBHOOK CRASH:", err);
    return NextResponse.json(
      { error: "Webhook crashed", message: err?.message },
      { status: 500 }
    );
  }
}
