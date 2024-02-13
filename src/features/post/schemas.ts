import { Schema, model, PaginateModel } from "mongoose";
import { Post } from "./types";
import mongoosePaginate from "mongoose-paginate-v2";
import { createdAtSchemaDefinition } from "../../utils/schemas";

const PostSchema = new Schema<Post>({
  ...createdAtSchemaDefinition,
  routeName: { type: String, required: true },
  amountAvailable: { type: Number },
  currency: { type: String, enum: ["CUP", "MLC", "USD"] },
  description: { type: String, required: true },
  details: { type: String },
  hidden: { type: Boolean },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  images: [
    {
      src: { type: String, required: true },
    },
  ],
  clothingSizes: [
    {
      type: String,
      enum: ["XXS", "XS", "S", "M", "L", "XL", "2XL", "3XL"],
    },
  ],
  colors: [
    {
      type: String,
      enum: ["white", "gray", "black"],
      required: true,
    },
  ],
  reviews: [
    {
      type: Number,
    },
    {
      type: Number,
    },
    {
      type: Number,
    },
    {
      type: Number,
    },
    {
      type: Number,
    },
  ],
  name: { type: String, required: true },
  price: { type: Number },
});

PostSchema.plugin(mongoosePaginate);

export const PostModel = model<Post, PaginateModel<Post>>(
  "Post",
  PostSchema,
  "posts"
);
