import { PaginateModel, Schema, model } from "mongoose";
import { Business } from "../types";
import mongoosePaginate from "mongoose-paginate-v2";
import { createdAtSchemaDefinition } from "../../../utils/schemas";

const BusinessSchema = new Schema<Business>({
  ...createdAtSchemaDefinition,
  name: { type: String, required: true },
  routeName: { type: String, required: true },
  category: { type: String, enum: ["food", "tool", "clothing", "service"] },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

BusinessSchema.plugin(mongoosePaginate);

export const BusinessModel = model<Business, PaginateModel<Business>>(
  "Business",
  BusinessSchema,
  "business"
);
