import { Schema, model, models } from "mongoose";

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

const HistoryModel = models.History || model("History", HistorySchema);

export default HistoryModel;   // ✅ सबसे जरूरी fix (default export)
