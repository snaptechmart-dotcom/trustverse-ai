import mongoose from "mongoose";

const HistorySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: String,
    info: String,
    score: Number,
    analysis: String,
  },
  { timestamps: true }
);

// IMPORTANT FIX → use mongoose.models NOT "models"
export const History =
  mongoose.models.History || mongoose.model("History", HistorySchema);
