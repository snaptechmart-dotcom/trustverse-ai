import mongoose, { Schema, models, model } from "mongoose";

const ProfileHistorySchema = new Schema(
  {
    profileUsername: {
      type: String,
      required: true,
    },
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
