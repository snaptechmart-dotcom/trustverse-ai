import mongoose, { Schema, models } from "mongoose";

const UserSchema = new Schema(
  {
    // 👤 BASIC INFO
    name: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },

    // 🔐 USER ROLE (ADMIN / USER)
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // 💼 SUBSCRIPTION PLAN (PLAN ↔ CREDIT LOGIC)
    plan: {
      type: String,
      enum: ["free", "essential", "pro", "enterprise"],
      default: "free",
    },

    // 💳 CREDITS SYSTEM (CORE SAAS LOGIC)
    credits: {
      type: Number,
      default: 5, // 🎁 Free users get 5 credits (one-time)
      min: 0,
    },

    // 📅 PLAN ACTIVATION DATE
    // Used for:
    // - Monthly credit reset (essential)
    // - Subscription tracking (future Razorpay)
    planActivatedAt: {
      type: Date,
    },
  },
  {
    timestamps: true, // createdAt & updatedAt
  }
);

// 🚀 SAFE EXPORT (NEXT.JS + HOT RELOAD FIX)
export default models.User || mongoose.model("User", UserSchema);
