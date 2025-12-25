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

    // 🔐 PASSWORD
    password: {
      type: String,
      required: true,
      select: false,
    },

    // 🔐 USER ROLE
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // 💼 SUBSCRIPTION PLAN (IMPORTANT)
    plan: {
      type: String,
      enum: ["FREE", "PRO"],
      default: "FREE",
    },

    planActivatedAt: {
      type: Date,
    },

    planExpiresAt: {
      type: Date,
    },

    // 💳 CREDITS SYSTEM
    credits: {
      type: Number,
      default: 10, // ✅ Free users start with 10 credits
      min: 0,
    },

    // ==============================
    // 🔒 TRUST SYSTEM (Optional Future)
    // ==============================
    trustScore: {
      type: Number,
      default: 70,
      min: 0,
      max: 100,
    },

    verifiedEmail: {
      type: Boolean,
      default: false,
    },

    verifiedPhone: {
      type: Boolean,
      default: false,
    },

    lastActiveAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default models.User || mongoose.model("User", UserSchema);
