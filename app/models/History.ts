import mongoose from "mongoose";

const HistorySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: String,
    info: String,
    score: Number,
    analysis: String,
  },
  { timestamps: true }
);

// ⭐ Only ONE named export — NO DEFAULT EXPORT
export const History =
  mongoose.models.History || mongoose.model("History", HistorySchema);
