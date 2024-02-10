import { Schema } from "mongoose";
import { BaseIdentity } from "../../types";

export type UserRole = "user" | "admin";

export interface User extends BaseIdentity {
  name: string;
  email: string;
  password: string;
  passwordVerbose: string; // remove after migration
  role: UserRole;
  validated: boolean;
  generateAccessJWT: () => string;
}
