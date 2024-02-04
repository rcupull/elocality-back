import { Schema } from "mongoose";
import { BaseIdentityT } from "./general";

export type SaleCurrency = "CUP";
export type SaleCategory = "food" | "tool" | "clothing" | "service";
export interface SaleImage {
  url: string;
}

export interface SalePostT extends BaseIdentityT {
  images: Array<SaleImage>;
  userId: Schema.Types.ObjectId;
  description: string;
  name: string;
  price: number;
  currency: SaleCurrency;
  category: SaleCategory;
  amountAvailable: number;
}
