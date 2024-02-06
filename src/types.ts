import { Request } from "express";
import { User } from "./features/user/types";

export type AnyRecord = Record<string, any>;

export interface BaseIdentity {
  _id: string;
  createdAt: Date;
}

export type RequestObject<
  P = AnyRecord,
  ResBody = any,
  ReqBody = any,
  ReqQuery = AnyRecord,
  Locals extends Record<string, any> = Record<string, any>
> = Request<P, ResBody, ReqBody, ReqQuery, Locals> & {
  user?: User;
};
