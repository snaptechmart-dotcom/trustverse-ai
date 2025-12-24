import mongoose from "mongoose";

const SubscriptionSchema = new mongoose.Schema(
  {
    subscriptionId: { type: String, required: true, unique: true },
    planId: String,
    status: String,
    paymentMethod: String,
    userEmail: String,
  },
  { timestamps: true }
);

export default mongoose.models.Subscription ||
  mongoose.model("Subscription", SubscriptionSchema);
