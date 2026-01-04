import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    plan: String,
    billing: String,
    credits: Number,
    razorpay_payment_id: String,
    razorpay_order_id: String,
    status: {
      type: String,
      default: "SUCCESS",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Payment ||
  mongoose.model("Payment", PaymentSchema);
