// app/models/History.ts
import mongoose, { Schema, model, models, Model, Document } from "mongoose";

interface IHistory extends Document {
  userId?: mongoose.Types.ObjectId;
  name?: string;
  info?: string;
  score?: number;
  analysis?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const HistorySchema = new Schema<IHistory>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    name: String,
    info: String,
    score: Number,
    analysis: String,
  },
  { timestamps: true }
);

// Ensure correct typing and single model creation
const History: Model<IHistory> =
  (models.History as Model<IHistory>) || model<IHistory>("History", HistorySchema);

export default History;
export type { IHistory };
