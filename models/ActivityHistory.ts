import mongoose, { Schema, Types } from "mongoose";

const ActivityHistorySchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    tool: {
      type: String,
      required: true,
      index: true,
    },

    input: {
      type: String,
      required: true,
    },

    inputKey: {
      type: String,
      required: true,
      index: true,
    },

    trustScore: Number,
    riskLevel: String,
    resultSummary: String,

    creditsUsed: {
      type: Number,
      default: 0,
    },

    lastSeenAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.models.ActivityHistory ||
  mongoose.model("ActivityHistory", ActivityHistorySchema);
