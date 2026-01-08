import mongoose, { Schema, models } from "mongoose";

const HistorySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    query: {
      type: String,
      required: true,
    },
    tool: {
      type: String,
      required: true,
    },
    result: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  { timestamps: true }
);

export default models.History || mongoose.model("History", HistorySchema);
