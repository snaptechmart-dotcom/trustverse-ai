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

    // 🔐 PASSWORD (REQUIRED FOR LOGIN)
    password: {
      type: String,
      required: true,
      select: false, // 🔒 security: default queries me password hide rahe
    },

    // 🔐 USER ROLE (ADMIN / USER)
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // 💼 SUBSCRIPTION PLAN
    plan: {
      type: String,
      enum: ["free", "essential", "pro", "enterprise"],
      default: "free",
    },

    planExpiresAt: {
      type: Date,
    },

    // 💳 CREDITS SYSTEM
    credits: {
      type: Number,
      default: 5,
      min: 0,
    },

    planActivatedAt: {
      type: Date,
    },

    // ==============================
    // 🔒 TRUST SCORE SYSTEM
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
