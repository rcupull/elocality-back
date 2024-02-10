import { Schema, model, PaginateModel } from "mongoose";
import { Post } from "../types";
import mongoosePaginate from "mongoose-paginate-v2";
import { createdAtSchemaDefinition } from "../../../utils/schemas";

const PostSchema = new Schema<Post>({
  ...createdAtSchemaDefinition,
  businessId: { type: Schema.Types.ObjectId, ref: "Business", required: true },
  amountAvailable: { type: Number },
  currency: { type: String, enum: ["CUP", "MLC", "USD"] },
  description: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  images: [
    {
      url: { type: String },
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
