import mongoose from "mongoose";

const ToolHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    tool: {
      type: String,
      required: true,
      trim: true,
    },

    input: {
      type: String,
      required: true,
      trim: true,
    },

    trustScore: {
      type: Number,
      required: true,
    },

    riskLevel: {
      type: String,
      required: true,
      trim: true,
    },

    signals: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

// 🔥 VERY IMPORTANT (prevent schema cache bugs)
export default mongoose.models.ToolHistory
  ? mongoose.models.ToolHistory
  : mongoose.model("ToolHistory", ToolHistorySchema);
