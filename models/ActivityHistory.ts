import mongoose, { Schema, models } from "mongoose";

const ActivityHistorySchema = new Schema(
  {
    userEmail: {
      type: String,
      required: true,
      index: true,
    },

    tool: {
      type: String,
      required: true,
      index: true,
    },

    // 🔹 ORIGINAL INPUT (UI ke liye)
    input: {
      type: String,
      required: true,
    },

    // 🔹 NORMALIZED INPUT (logic / upsert ke liye)
    inputKey: {
      type: String,
      required: true,
      index: true,
    },

    riskLevel: {
      type: String,
      default: null,
    },

    trustScore: {
      type: Number,
      default: null,
    },

    resultSummary: {
      type: String,
      default: null,
    },

    signals: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default models.ActivityHistory ||
  mongoose.model("ActivityHistory", ActivityHistorySchema);
