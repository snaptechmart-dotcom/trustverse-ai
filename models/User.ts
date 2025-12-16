import mongoose, { Schema, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: String,

    email: {
      type: String,
      unique: true,
      required: true,
    },

    // 🔐 USER ROLE (IMPORTANT FOR ADMIN)
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // 🔐 SUBSCRIPTION PLAN
    plan: {
      type: String,
      enum: ["free", "pro", "business"],
      default: "free",
    },

    // Optional future use
    planActivatedAt: Date,
  },
  { timestamps: true }
);

export default models.User || mongoose.model("User", UserSchema);
