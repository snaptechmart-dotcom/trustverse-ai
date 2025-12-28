import mongoose, { Schema, models } from "mongoose";

const ScamReportSchema = new Schema(
  {
    reportedEmail: { type: String, required: true },
    reportedBy: { type: String, required: true }, // user email
    reason: { type: String, required: true },
    proofUrl: { type: String },
    impact: { type: Number, default: -20 },
    resolved: { type: Boolean, default: false },
    resolvedAt: { type: Date },
  },
  { timestamps: true }
);

export default models.ScamReport ||
  mongoose.model("ScamReport", ScamReportSchema);
