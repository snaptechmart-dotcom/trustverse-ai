import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    let { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password required" },
        { status: 400 }
      );
    }

    // ✅ NORMALIZE EMAIL (CRITICAL FIX)
    email = email.trim().toLowerCase();

    // 🔍 CHECK EXISTING USER
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 409 }
      );
    }

    // 🔐 HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    // 👤 CREATE USER (FREE PLAN DEFAULT)
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        plan: "free",
        billing: null,
        credits: 10,          // ✅ free user credits
        planExpiresAt: null, // ✅ no expiry
      },
    });

    return NextResponse.json(
      { message: "Signup successful" },
      { status: 201 }
    );
  } catch (error) {
    console.error("SIGNUP ERROR 👉", error);
    return NextResponse.json(
      { message: "Signup failed" },
      { status: 500 }
    );
  }
}
