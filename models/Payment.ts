import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    plan: String,
    billing: String,
    credits: Number,
    razorpay_payment_id: String,
    razorpay_order_id: String,
    status: String,
    createdAt: Date,
  },
  { timestamps: true }
);

export default mongoose.models.Payment ||
  mongoose.model("Payment", PaymentSchema);
