import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    plan: { type: String, required: true },
    billing: { type: String },

    amount: { type: Number, required: true }, // paise me (₹ * 100)
    creditsAdded: { type: Number, required: true },

    razorpay_payment_id: { type: String },
    razorpay_order_id: { type: String },

    status: { type: String, default: "SUCCESS" },
  },
  { timestamps: true }
);

export default mongoose.models.Payment ||
  mongoose.model("Payment", PaymentSchema);
