import mongoose, { Schema, models } from "mongoose";

const ComplaintSchema = new Schema(
  {
    againstUsername: { type: String, required: true },
    email: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },

    status: {
      type: String,
      enum: ["pending", "resolved", "rejected"],
      default: "pending",
    },

    resolvedAt: { type: Date },
  },
  { timestamps: true }
);

export default models.Complaint ||
  mongoose.model("Complaint", ComplaintSchema);
