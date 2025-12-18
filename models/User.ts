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

    // 💼 SUBSCRIPTION PLAN
    plan: {
      type: String,
      enum: ["free", "pro", "business"],
      default: "free",
    },

    // 💳 CREDITS SYSTEM (CORE SAAS LOGIC)
    credits: {
      type: Number,
      default: 5, // 🎁 free user gets 5 credits
      min: 0,
    },

    // 📅 PLAN ACTIVATION DATE (FUTURE BILLING USE)
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
