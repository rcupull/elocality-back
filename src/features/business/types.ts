import { BaseIdentity } from "../../types";
import { Schema } from "mongoose";

export type BusinessCategory = "food" | "tool" | "clothing" | "service";

export interface Business extends BaseIdentity {
  name: string;
  category: BusinessCategory;
  routeName: string;
  createdBy: Schema.Types.ObjectId; // userId
}
