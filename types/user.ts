import { Types } from "mongoose";

export interface DBUser {
  _id: Types.ObjectId;
  email: string;
  password?: string;
  name?: string;
  image?: string;
  plan: string;
  credits: number;
}
