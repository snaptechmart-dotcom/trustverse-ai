import mongoose, { Schema, models } from "mongoose";

const TrustScoreSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    score: {
      type: Number,
      default: 100,
      min: 0,
      max: 100,
    },
    lastUpdatedReason: {
      type: String,
      default: "Initial score",
    },
  },
  { timestamps: true }
);

export default models.TrustScore ||
  mongoose.model("TrustScore", TrustScoreSchema);
