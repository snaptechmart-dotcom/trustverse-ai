import mongoose, { Schema, models } from "mongoose";

/* =========================
   HISTORY SCHEMA (POWER HOUSE)
========================= */
const HistorySchema = new Schema(
  {
    /* =========================
       USER
    ========================= */
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    /* =========================
       TOOL TYPE
    ========================= */
    tool: {
      type: String,
      required: true,
      enum: [
        "TRUST_SCORE",
        "PHONE_CHECK",
        "EMAIL_CHECK",
        "PROFILE_CHECK",
        "BUSINESS_CHECK",
        "SOCIAL_CHECK",
        "ADVANCED_AI",
      ],
      index: true,
    },

    /* =========================
       INPUT
    ========================= */
    input: {
      type: String,
      required: true,
      trim: true,
    },

    /**
     * inputKey is used for:
     * - de-duplication
     * - grouping
     * - analytics
     */
    inputKey: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    /* =========================
       AI SUMMARY
    ========================= */
    summary: {
      trustScore: {
        type: Number,
        min: 0,
        max: 100,
      },

      riskLevel: {
        type: String,
        enum: ["Low Risk", "Medium Risk", "High Risk"],
      },

      verdict: {
        type: String,
        trim: true,
      },

      /**
       * Long human-readable explanation
       * (used in View Full Report)
       */
      explanation: {
        type: String,
        trim: true,
      },
    },

    /* =========================
       CREDITS
    ========================= */
    creditsUsed: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true, // createdAt / updatedAt
  }
);

/* =========================
   SAFE MODEL EXPORT
========================= */
export default models.History ||
  mongoose.model("History", HistorySchema);
