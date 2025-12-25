import mongoose, { Schema, models, model } from "mongoose";

const SubscriptionSchema = new Schema(
  {
    subscriptionId: {
      type: String,
      required: true,
      unique: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    planId: {
      type: String,
    },

    status: {
      type: String,
      enum: [
        "created",
        "authenticated",
        "active",
        "paused",
        "cancelled",
        "completed",
      ],
      required: true,
    },

    paymentMethod: {
      type: String,
      default: "upi",
    },

    currentPeriodEnd: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default models.Subscription ||
  model("Subscription", SubscriptionSchema);
