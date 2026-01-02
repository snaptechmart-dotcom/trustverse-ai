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
    },

    // 🔥 INPUT (email / phone / text)
    input: {
      type: String,
      required: true,
    },

    // 🔥 RESULT OBJECT (REQUIRED – THIS WAS THE ERROR)
    result: {
      trustScore: {
        type: Number,
        required: true,
      },
      riskLevel: {
        type: String,
        required: true,
      },
      signals: {
        type: [String],
        default: [],
      },
      remainingCredits: {
        type: mongoose.Schema.Types.Mixed,
      },
    },
  },
  { timestamps: true }
);

export default mongoose.models.ToolHistory ||
  mongoose.model("ToolHistory", ToolHistorySchema);
