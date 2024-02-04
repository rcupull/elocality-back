import { Schema, model } from "mongoose";
import { SalePostT } from "../../../types/post";

const SalePostSchema = new Schema<SalePostT>({
  createdAt: { type: Date, default: Date.now },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  amountAvailable: { type: Number, required: true },
  category: { type: String, enum: ["food", "tool", "clothing", "service"] },
  currency: { type: String, enum: ["CUP"] },
  description: { type: String },
  images: [
    {
      url: { type: String },
    },
  ],
  name: { type: String },
  price: { type: Number },
});

export const SalePostModel = model<SalePostT>(
  "SalePost",
  SalePostSchema,
  "sale_posts"
);
