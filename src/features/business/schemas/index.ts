import { Schema, model } from "mongoose";
import { Business } from "../types";
import { getRouteName } from "../../../utils/general";

const BusinessSchema = new Schema<Business>({
  name: { type: String, required: true },
  routeName: { type: String },
  category: { type: String, enum: ["food", "tool", "clothing", "service"] },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

BusinessSchema.pre("save", async function (next) {
  const business = this;

  if (business.isModified("name")) {
    business.routeName = getRouteName(business.name);
  }

  next();
});

export const BusinessModel = model<Business>(
  "Business",
  BusinessSchema,
  "business"
);
