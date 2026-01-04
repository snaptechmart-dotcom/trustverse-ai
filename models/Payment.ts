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

    razorpay_payment_id: {
      type: String,
      required: true,
      unique: true,
    },

    razorpay_order_id: {
      type: String,
    },

    status: {
      type: String,
      enum: ["SUCCESS", "FAILED"],
      required: true,
    },

    provider: {
      type: String,
      default: "Razorpay",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Payment ||
  mongoose.model("Payment", PaymentSchema);
