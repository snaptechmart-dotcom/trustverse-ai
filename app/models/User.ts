import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name?: string;
  email: string;
  password?: string;
  plan?: string;
  subscriptionId?: string;
  subscriptionStatus?: string;
  planValidTill?: Date;
  trustChecksUsed?: number;
  reportsUsed?: number;
  lastPaymentId?: string;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String },

    plan: { type: String, default: "free" },
    subscriptionId: { type: String },
    subscriptionStatus: { type: String, default: "inactive" },
    planValidTill: { type: Date },

    trustChecksUsed: { type: Number, default: 0 },
    reportsUsed: { type: Number, default: 0 },

    lastPaymentId: { type: String }
  },
  { timestamps: true }
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
