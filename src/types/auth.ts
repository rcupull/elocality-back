import { Schema } from "mongoose";

export interface SessionT {
  token: string;
  createdAt: Date;
  userId: Schema.Types.ObjectId;
}

export type UserRoleT = "user" | "admin";

export interface UserT {
  name: string;
  email: string;
  password: string;
  role: UserRoleT;
  createdAt: Date;
  validated: boolean;
  generateAccessJWT: () => string;
}

export interface ValidationCodeT {
  code: string;
  createdAt: Date;
  userId: Schema.Types.ObjectId;
}
