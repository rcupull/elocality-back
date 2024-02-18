import { BaseIdentity, Image } from "../../types";
import { Schema } from "mongoose";

export type BusinessCategory = "food" | "tool" | "clothing" | "service";

export interface Business extends BaseIdentity {
  name: string;
  routeName: string;
  category: BusinessCategory;
  createdBy: Schema.Types.ObjectId; // userId
  hidden?: boolean;
  bannerImages?: Array<Image>;
  bannerImageStyle?: "static";
  socialLinks: {
    face?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
  };
}
