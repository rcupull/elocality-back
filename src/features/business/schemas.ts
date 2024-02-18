import { PaginateModel, Schema, model } from "mongoose";
import { Business } from "./types";
import mongoosePaginate from "mongoose-paginate-v2";
import { createdAtSchemaDefinition } from "../../utils/schemas";
import { PostModel } from "../post/schemas";

const BusinessSchema = new Schema<Business>({
  ...createdAtSchemaDefinition,
  name: { type: String, required: true },
  routeName: { type: String, required: true },
  hidden: { type: Boolean, default: false },
  category: { type: String, enum: ["food", "tool", "clothing", "service"] },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  bannerImages: {
    type: [
      {
        src: { type: String, required: true },
      },
    ],
    default: [],
  },
  bannerImageStyle: { type: String, enum: ["static"], default: "static" },
  socialLinks: {
    face: { type: String },
    instagram: { type: String },
    twitter: { type: String },
    linkedin: { type: String },
    youtube: { type: String },
  },
});

BusinessSchema.plugin(mongoosePaginate);

BusinessSchema.pre("updateOne", async function (next) {
  //@ts-expect-error ignored
  const { hidden } = this.getUpdate();
  const { routeName } = this.getQuery();

  if (hidden !== undefined) {
    await PostModel.updateMany(
      {
        routeName,
      },
      {
        hiddenBusiness: hidden,
      }
    );
  }

  next();
});

export const BusinessModel = model<Business, PaginateModel<Business>>(
  "Business",
  BusinessSchema,
  "business"
);
