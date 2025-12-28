import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

// 🔥 TEMP USER SCHEMA (JS ONLY)
const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

async function resetPassword() {
  try {
    console.log("⏳ Connecting DB...");
    await mongoose.connect(process.env.MONGODB_URI);

    const hashed = await bcrypt.hash("Test@123", 10);

    const result = await User.updateOne(
      { email: "testfree@gmail.com" },
      { $set: { password: hashed } }
    );

    console.log("✅ Update Result:", result);
    process.exit(0);
  } catch (err) {
    console.error("❌ ERROR:", err);
    process.exit(1);
  }
}

resetPassword();
