import mongoose, { Schema, models } from "mongoose";

const ToolHistorySchema = new Schema(
  {
    userEmail: {
      type: String,
      required: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
    },
    input: {
      type: String,
      required: true,
    },
    result: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default models.ToolHistory ||
  mongoose.model("ToolHistory", ToolHistorySchema);
