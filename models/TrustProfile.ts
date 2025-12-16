import mongoose, { Schema, models, model } from "mongoose";

const TrustProfileSchema = new Schema(
  {
    // 🔐 Auth linkage (NextAuth safe)
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // 🌐 Public identity
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // 👤 Display info
    displayName: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      trim: true,
    },

    bio: {
      type: String,
      maxlength: 500,
      trim: true,
    },

    // ✅ Verification badge (Admin controlled)
    verified: {
      type: Boolean,
      default: false,
    },

    // 🛡️ Admin manual trust (0–30)
    adminScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 30,
    },

    // ⭐ Final Trust Score (0–100)
    trustScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  { timestamps: true }
);

export default models.TrustProfile ||
  model("TrustProfile", TrustProfileSchema);
