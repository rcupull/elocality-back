import { Schema } from "mongoose";
import { AnyRecord, BaseIdentityT } from "./general";
import { Request } from "express";

export interface SessionT extends BaseIdentityT {
  token: string;
  userId: Schema.Types.ObjectId;
}

export type UserRoleT = "user" | "admin";

export interface UserT extends BaseIdentityT {
  name: string;
  routeName: string;
  email: string;
  password: string;
  role: UserRoleT;
  validated: boolean;
  generateAccessJWT: () => string;
}

createdAt: Date;
export interface ValidationCodeT extends BaseIdentityT {
  code: string;
  userId: Schema.Types.ObjectId;
}

export interface RequestWithUser<
  ResBody = any,
  ReqBody = AnyRecord,
  ReqQuery = any
> extends Request<never, never, ReqBody & { user: UserT }> {}
