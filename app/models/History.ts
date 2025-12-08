import mongoose, { Schema, models, model } from "mongoose";

const HistorySchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    name: String,
    info: String,
    score: Number,
    analysis: String,
  },
  { timestamps: true }
);

// FIXED: Correct model export for Next.js + Mongoose
const History = models.History || model("History", HistorySchema);

export default History;
export { History };
