import mongoose, { Schema, models } from "mongoose";

const HistorySchema = new Schema(
  {
    action: String,
    adminEmail: String,
    profileUsername: String,
    reason: String,
  },
  { timestamps: true }
);

export default models.History || mongoose.model("History", HistorySchema);
