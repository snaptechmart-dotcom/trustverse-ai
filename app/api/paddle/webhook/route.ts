import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    console.log("PADDLE WEBHOOK RECEIVED");

    return new Response("OK", { status: 200 });
  } catch (err) {
    console.error("Webhook error", err);
    return new Response("ERROR", { status: 200 });
  }
}
