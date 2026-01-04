import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    plan: {
      type: String,
      required: true,
    },

    billing: {
      type: String,
      required: true,
    },

    credits: {
      type: Number,
      required: true,
    },

    // 🔹 Razorpay identifiers
    paymentId: {
      type: String,
      required: true,
    },

    orderId: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      default: "SUCCESS",
    },

    provider: {
      type: String,
      default: "Razorpay",
    },
  },
  {
    timestamps: true, // ✅ createdAt / updatedAt auto handled
  }
);

export default mongoose.models.Payment ||
  mongoose.model("Payment", PaymentSchema);
