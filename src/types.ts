import { Request } from "express";
import { User } from "./features/user/types";

export type AnyRecord = Record<string, any>;

export interface BaseIdentity {
  _id: string;
  createdAt: Date;
}
