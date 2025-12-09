// app/models/History.ts
import mongoose, { Schema, model, models } from "mongoose";

const HistorySchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    name: { type: String },
    info: { type: String },
    score: { type: Number },
    analysis: { type: String },
  },
  { timestamps: true }
);

// Ensure correct typing for TS: prefer exporting default model
const History = (models.History as mongoose.Model<any>) || model("History", HistorySchema);

export default History;

