import mongoose from "mongoose";

const HistorySchema = new mongoose.Schema(
  {
    type: { type: String, required: true },   // Tool name
    input: { type: String, required: true },  // User input
    result: { type: String },                  // Risk / Score summary
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.History ||
  mongoose.model("History", HistorySchema);
