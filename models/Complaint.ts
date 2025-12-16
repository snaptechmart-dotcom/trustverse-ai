import mongoose, { Schema, models } from "mongoose";

const ComplaintSchema = new Schema(
  {
    profileUsername: {
      type: String,
      required: true,
      index: true,
    },
    reportedBy: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
      required: true,
      maxlength: 500,
    },
    status: {
      type: String,
      enum: ["pending", "resolved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default models.Complaint ||
  mongoose.model("Complaint", ComplaintSchema);
