import mongoose, { Schema, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    plan: {
      type: String,
      enum: ["FREE", "PRO"],
      default: "FREE",
    },

    credits: {
      type: Number,
      default: 10,
    },

    trustScore: {
      type: Number,
      default: 70,
    },
  },
  { timestamps: true }
);

export default models.User || mongoose.model("User", UserSchema);
