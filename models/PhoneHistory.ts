import mongoose, { Schema, models } from "mongoose";

const PhoneHistorySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    riskLevel: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default models.PhoneHistory ||
  mongoose.model("PhoneHistory", PhoneHistorySchema);
