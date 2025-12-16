import mongoose, { Schema, models } from "mongoose";

const ProfileSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },

    email: String,
    bio: String,
    category: String,
    location: String,

    trustScore: {
      type: Number,
      default: 100,
    },

    adminScore: {
      type: Number,
      default: 0,
    },

    verified: {
      type: Boolean,
      default: false,
    },

    // 🔒 Admin moderation
    isSuspended: {
      type: Boolean,
      default: false,
    },

    trustLocked: {
      type: Boolean,
      default: false,
    },

    adminNotes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default models.Profile ||
  mongoose.model("Profile", ProfileSchema, "trustprofiles");
