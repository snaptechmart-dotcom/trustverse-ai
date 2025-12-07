import dbConnect from "@/app/lib/dbConnect";
import User from "@/app/models/User";

import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();
    await dbConnect();

    if (!email || !password) {
      return Response.json({ error: "Email & password required" }, { status: 400 });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return Response.json({ error: "Email already exists" }, { status: 400 });
    }

    const hashedPass = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPass,
      plan: "free",
      subscriptionStatus: "inactive",
    });

    return Response.json({ message: "Signup successful" }, { status: 201 });
  } catch (err) {
    console.error("Signup error:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
