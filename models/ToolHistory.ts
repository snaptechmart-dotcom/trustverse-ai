import mongoose, { Schema, models } from "mongoose";

const ToolHistorySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    tool: {
  type: String,
  enum: [
    "phone-checker",
    "email-checker",
    "profile-checker",
    "trust-score",
    "business-checker",
    "social-analyzer",
    "advanced-analysis" // ✅ FINAL FIX
  ],
  required: true,
},

    // 🔥 UNIVERSAL INPUT (OBJECT SAFE FOR ALL TOOLS)
    input: {
      type: Object,
      required: true,
    },

    // 🔥 UNIVERSAL RESULT (OBJECT SAFE FOR ALL TOOLS)
    result: {
      type: Object,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default models.ToolHistory ||
  mongoose.model("ToolHistory", ToolHistorySchema);
