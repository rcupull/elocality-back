import { Schema } from "mongoose";
import { BaseIdentity } from "../../types";

export type PostCurrency = "CUP" | "MLC" | "USD";

export interface PostImage {
  url: string;
}

export interface Post extends BaseIdentity {
  images?: Array<PostImage>;
  routeName: string; // routeName from business
  createdBy: Schema.Types.ObjectId;
  description: string;
  name: string;
  price?: number;
  currency?: PostCurrency;
  amountAvailable?: number;
}
