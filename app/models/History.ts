import mongoose from "mongoose";

const HistorySchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    input: String,
    output: String,
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.History || mongoose.model("History", HistorySchema);
