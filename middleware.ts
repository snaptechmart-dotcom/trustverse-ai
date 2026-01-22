import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // 🔒 Paddle webhook ko bilkul bypass karo
  if (req.nextUrl.pathname.startsWith("/api/paddle/webhook")) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next).*)"],
};
