import { Schema } from "mongoose";
import { BaseIdentity } from "../../types";

export type PostCurrency = "CUP" | "MLC" | "USD";

export interface PostImage {
  url: string;
}

export type PostColor = "white" | "gray" | "black";

export type PostClothingSize =
  | "XXS"
  | "XS"
  | "S"
  | "M"
  | "L"
  | "XL"
  | "2XL"
  | "3XL";

export type PostReviews = [number, number, number, number, number];

export interface Post extends BaseIdentity {
  images?: Array<PostImage>;
  routeName: string; // routeName from business
  createdBy: Schema.Types.ObjectId;
  description: string;
  details?: string;
  name: string;
  price?: number;
  currency?: PostCurrency;
  amountAvailable?: number;
  reviews?: PostReviews;
  colors?: Array<PostColor>;
  highlights?: Array<string>;
  hidden?: boolean;
  hiddenBusiness?: boolean;
  // clothing
  clothingSizes?: Array<PostClothingSize>;
}
