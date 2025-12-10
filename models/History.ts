import mongoose, { Schema, Document, Model } from "mongoose";

// Interface for TypeScript
export interface IHistory extends Document {
  userId: string;
  prompt: string;
  response: string;
  createdAt: Date;
  updatedAt: Date;
}

// Prevent re-registering model in dev mode
const HistorySchema = new Schema<IHistory>(
  {
    userId: { type: String, required: true },
    prompt: { type: String, required: true },
    response: { type: String, required: true },
  },
  { timestamps: true }
);

// FIX: Correct model creation with proper TS typing
const History: Model<IHistory> =
  mongoose.models.History ||
  mongoose.model<IHistory>("History", HistorySchema);

export default History;
