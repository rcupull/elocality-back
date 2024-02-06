import { Schema, model } from "mongoose";
import { Post } from "../types";

const PostSchema = new Schema<Post>({
  createdAt: { type: Date, default: Date.now },
  businessId: { type: Schema.Types.ObjectId, ref: "Business", required: true },
  amountAvailable: { type: Number },
  currency: { type: String, enum: ["CUP", "MLC", "USD"] },
  description: { type: String, required: true },
  images: [
    {
      url: { type: String },
    },
  ],
  name: { type: String, required: true },
  price: { type: Number },
});

export const PostModel = model<Post>("Post", PostSchema, "posts");
