console.log("Report model loaded");
import mongoose, { Schema, models, model } from "mongoose";

const ReportSchema = new Schema(
  {
    reportId: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, required: true },

    toolType: String,
    inputValue: String,

    summary: {
      trustScore: Number,
      riskLevel: String,
      verdict: String,
    },

    fullReport: Schema.Types.Mixed,
  },
  { timestamps: true }
);

export default models.Report || model("Report", ReportSchema);
