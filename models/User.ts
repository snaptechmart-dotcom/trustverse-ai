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

    // 💼 SUBSCRIPTION PLAN (MONETIZATION READY)
    plan: {
      type: String,
      enum: ["free", "essential", "pro", "enterprise"],
      default: "free",
    },

    // 📅 PLAN EXPIRY (STEP 1.5 ADD)
    // Used later in STEP 1.6 (Payments)
    planExpiresAt: {
      type: Date,
    },

    // 💳 CREDITS SYSTEM (CORE SAAS LOGIC)
    credits: {
      type: Number,
      default: 5, // 🎁 Free users get 5 credits
      min: 0,
    },

    // 📅 PLAN ACTIVATION DATE
    planActivatedAt: {
      type: Date,
    },

    // ==============================
    // 🔒 TRUST SCORE SYSTEM (STEP 1.x)
    // ==============================

    trustScore: {
      type: Number,
      default: 70, // 🎯 Default Trust Score
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

    // 🕒 ACTIVITY TRACKING (INACTIVITY PENALTY)
    lastActiveAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // createdAt & updatedAt
  }
);

// 🚀 SAFE EXPORT (NEXT.JS + HOT RELOAD FIX)
export default models.User || mongoose.model("User", UserSchema);
