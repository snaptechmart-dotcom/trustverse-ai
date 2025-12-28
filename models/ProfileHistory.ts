import mongoose, { Schema, models, model } from "mongoose";

const ProfileHistorySchema = new Schema(
  {
    // 🔹 OLD SYSTEM (complaints / profile based)
    profileUsername: {
      type: String,
      default: "",
    },

    // 🔹 NEW SYSTEM (scam reports / email based)
    userEmail: {
      type: String,
      default: "",
    },

    // 🔹 COMMON
    action: {
      type: String,
      required: true,
    },

    impact: {
      type: Number,
      default: 0,
    },

    reason: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const ProfileHistory =
  models.ProfileHistory || model("ProfileHistory", ProfileHistorySchema);

export default ProfileHistory;
