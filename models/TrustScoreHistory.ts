import mongoose, { Schema, models } from "mongoose";

const TrustScoreHistorySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    impact: {
      type: Number,
      required: true,
    },
    oldScore: {
      type: Number,
    },
    newScore: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

export default models.TrustScoreHistory ||
  mongoose.model("TrustScoreHistory", TrustScoreHistorySchema);
